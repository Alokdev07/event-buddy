import {Router} from 'express'
import { get_profile, Google_log_in, Google_log_out } from '../controller/user.controller.js'
import verify_jwt from '../middleware/auth.middleware.js'

const route = Router()

route.post("/auth_login",Google_log_in)
route.get('/auth_logout',verify_jwt,Google_log_out)
route.get('/auth_getprofile',verify_jwt,get_profile)

export default route