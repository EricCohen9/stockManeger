import * as yup from 'yup';
import { Request,Response, NextFunction } from 'express';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
});

// export const validateUser = (req: Request,res: Response,next: NextFunction) => {
//     const { email, password } = req.body;
//     try {
//       validationSchema.validateSync({ email, password }, { abortEarly: false });
//       next();
//     } catch (error:any) {
//       res.status(400).json({ errors: error.errors });
//     }
//   };

  export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        validationSchema.validateSync({ email, password }, { abortEarly: false });
        next();
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            throw error 
        }
    }
};

