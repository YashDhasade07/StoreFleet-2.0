import authService from '../services/authService.js';
import {
    validateEmail,
    validatePassword,
    validateName,
    validateAddress
} from '../utils/validation.js';

// Register new normal user
export const register = async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
 
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        if (!validateName(name)) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 20 and 60 characters'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 8-16 characters with at least one uppercase letter and one special character'
            });
        }

        if (!validateAddress(address)) {
            return res.status(400).json({
                success: false,
                message: 'Address must not exceed 400 characters'
            });
        }

        // Call service        
        const result = await authService.registerUser({ name, email, password, address });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result
        });

    } catch (error) {
        console.error('Registration error:', error);

        if (error.message === 'User with this email already exists') {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

// Login for all user types
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Call service
        const result = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// Change password
// export const changePassword = async (req, res) => {
//     try {
//         const { currentPassword, newPassword } = req.body;
//         const userId = req.user.id;

//         // Input validation
//         if (!currentPassword || !newPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Current password and new password are required'
//             });
//         }

//         if (!validatePassword(newPassword)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'New password must be 8-16 characters with at least one uppercase letter and one special character'
//             });
//         }

//         // Call service
//         await authService.changePassword(userId, currentPassword, newPassword);

//         res.status(200).json({
//             success: true,
//             message: 'Password updated successfully'
//         });

//     } catch (error) {
//         console.error('Change password error:', error);

//         if (error.message.includes('not found') || error.message.includes('incorrect') || error.message.includes('different')) {
//             return res.status(400).json({
//                 success: false,
//                 message: error.message
//             });
//         }

//         res.status(500).json({
//             success: false,
//             message: 'Server error during password change'
//         });
//     }
// };

export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

export const getCurrentUser = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User profile retrieved successfully',
        data: { user: req.user }
    });
};
