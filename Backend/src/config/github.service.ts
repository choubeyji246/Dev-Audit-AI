import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
}); // Public repo access. For private repos, pass an auth token.

export interface IRepoFile {
  path: string;
  content: string;
}

// Folders we completely skip to optimize performance and token usage
const IGNORED_DIRECTORIES = ['node_modules', 'dist', 'build', '.git', 'coverage', 'package-lock.json', 'yarn.lock'];
const ALLOWED_EXTENSIONS = ['.js', '.ts', '.py', '.java'];

export const fetchRepositoryContents = async (owner: string, repo: string, path = ''): Promise<IRepoFile[]> => {
  let files: IRepoFile[] = [];

  try {
    // Fetch directory listing from GitHub API
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const items = Array.isArray(response.data) ? response.data : [response.data];

    for (const item of items) {
      // If it's an ignored directory, skip it completely
      if (IGNORED_DIRECTORIES.includes(item.name)) continue;

      if (item.type === 'dir') {
        // Recursively traverse subdirectories
        const subFiles = await fetchRepositoryContents(owner, repo, item.path);
        files = files.concat(subFiles);
      } else if (item.type === 'file') {
        // Verify if the file extension matches our supported programming languages
        const hasAllowedExtension = ALLOWED_EXTENSIONS.some((ext) => item.name.endsWith(ext));
        if (!hasAllowedExtension) continue;

        // Fetch individual raw file contents
        const fileContentRes = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
          headers: { accept: 'application/vnd.github.v3.raw' },
        });

        // Ensure content is treated as a string payload
        const content = typeof fileContentRes.data === 'string' 
          ? fileContentRes.data 
          : JSON.stringify(fileContentRes.data);

        files.push({
          path: item.path,
          content,
        });
      }
    }
  } catch (error) {
    console.error(`❌ Error parsing path "${path}" in GitHub repo:`, error);
  }

  return files;
};