import { Router } from 'express';
import { triggerRepoScan, triggerRepoChat } from '../controllers/repo.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

// Secure all endpoints inside this file under the auth guard shield
router.use(authGuard);

router.post('/scan', triggerRepoScan);
router.post('/:repoId/chat', triggerRepoChat)


export default router;