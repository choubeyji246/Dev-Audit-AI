import { Router } from 'express';
import { triggerRepoScan, triggerRepoChat, getRepoReport, getMetricsSummary, listUserRepos } from '../controllers/repo.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();

// Secure all endpoints inside this file under the auth guard shield
router.use(authGuard);

router.post('/scan', triggerRepoScan);
router.post('/:repoId/chat', triggerRepoChat)

// Report view for a single repository
router.get('/report/:repoId', getRepoReport);

// Metrics summary for dashboard
router.get('/metrics-summary', getMetricsSummary);

// List user repositories
router.get('/', listUserRepos);


export default router;