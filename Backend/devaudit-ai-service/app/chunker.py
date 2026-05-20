import tiktoken
from typing import List, Dict, Any

class CodeChunker:
    def __init__(self, model_name: str = "gpt-4o", chunk_size: int = 1000, chunk_overlap: int = 200):
        """
        Initializes the token-aware chunker.
        :param model_name: The OpenAI model name used to fetch the correct encoding (cl100k_base / o200k_base).
        :param chunk_size: Maximum number of tokens allowed per single code chunk.
        :param chunk_overlap: Number of tokens to duplicate between adjacent chunks to maintain context.
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        try:
            # Dynamically fetch OpenAI's tokenizer mapping for the given model
            self.tokenizer = tiktoken.encoding_for_model(model_name)
        except KeyError:
            # Fallback encoding if the specific model name structure isn't mapped locally
            self.tokenizer = tiktoken.get_encoding("cl100k_base")

    def split_file(self, file_path: str, file_content: str) -> List[Dict[str, Any]]:
        """
        Slices a single source code file into a series of token-bounded metadata chunks.
        """
        chunks = []
        # Convert raw string content into an array of integer token IDs
        tokens = self.tokenizer.encode(file_content)
        total_tokens = len(tokens)

        if total_tokens == 0:
            return chunks

        start_idx = 0
        chunk_sequence = 1

        # Sliding window loop logic
        while start_idx < total_tokens:
            end_idx = min(start_idx + self.chunk_size, total_tokens)
            chunk_tokens = tokens[start_idx:end_idx]

            # Decode the slice of token IDs back into standard code strings
            chunk_text = self.tokenizer.decode(chunk_tokens)

            chunks.append({
                "file_path": file_path,
                "chunk_id": f"{file_path}#chunk-{chunk_sequence}",
                "content": chunk_text,
                "token_count": len(chunk_tokens),
                "start_token": start_idx,
                "end_token": end_idx
            })

            chunk_sequence += 1
            
            # Step forward by chunk size minus overlap to retain structural context
            if end_idx == total_tokens:
                break
            start_idx += self.chunk_size - self.chunk_overlap

        return chunks

    def process_repository(self, files: List[Dict[str, str]]) -> List[Dict[str, Any]]:
        """
        Processes an entire repository array, returning a unified flat list of code chunks.
        """
        all_chunks = []
        for file in files:
            file_chunks = self.split_file(file["path"], file["content"])
            all_chunks.extend(file_chunks)
        return all_chunks