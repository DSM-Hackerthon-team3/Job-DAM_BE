import { Router } from 'express';
import { UserController } from '../../controllers/user/userController';

const router = Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));
router.post('/:id/aptitude-test', (req, res) => userController.aptitudeTest(req, res));
router.post('/:id/job-experience', (req, res) => userController.jobExperience(req, res));
router.post('/:id/trust-evaluation', (req, res) => userController.trustEvaluation(req, res));
router.get('/:id', (req, res) => userController.getMyPage(req, res));
router.put('/:id/profile', (req, res) => userController.updateProfile(req, res));
router.put('/:id/password', (req, res) => userController.changePassword(req, res));

export default router;