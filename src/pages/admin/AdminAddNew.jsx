import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/apiClient';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminAddNewAdmin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(null);

        // Validation
        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const result = await api.auth.createAdmin({
                email: formData.email.trim(),
                name: formData.name.trim()
            });

            setSuccess({
                email: result.user.email,
                name: result.user.name,
                tempPassword: result.user.tempPassword,
                message: result.message,
                emailSent: result.email_sent,
                emailStatus: result.email_status,
                emailPreview: result.email_preview
            });

            // Reset form
            setFormData({ email: '', name: '' });

        } catch (err) {
            const errorMsg = err.message || 'Failed to create admin';
            
            // Handle specific error cases
            if (err.status === 409) {
                setError('This user already exists');
            } else if (err.status === 403) {
                setError('You do not have permission to create admins');
            } else if (err.status === 401) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => api.auth.redirectToLogin(), 2000);
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="font-display font-bold text-2xl text-foreground mb-1">Add New Admin</h1>
                <p className="text-muted-foreground text-sm font-mono-code">Hardware Prototyping Studio // CMS</p>
            </div>

            {/* Success Alert */}
            {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        <div className="font-semibold mb-2">✓ Admin Created Successfully</div>
                        <div className="text-sm space-y-2">
                            <div><strong>Email:</strong> {success.email}</div>
                            {success.name && <div><strong>Name:</strong> {success.name}</div>}
                            <div className="bg-white p-2 rounded border border-green-200 font-mono text-xs">
                                <strong>Temporary Password:</strong> {success.tempPassword}
                            </div>
                            <div className="text-xs pt-3 border-t border-green-200 mt-3">
                                <div className={`font-semibold ${success.emailSent ? 'text-green-700' : 'text-amber-700'}`}>
                                    {success.emailSent ? '✓ Email Status:' : '⚠️ Email Status:'}
                                </div>
                                <div className="text-green-700 mt-1">{success.emailStatus}</div>
                                {success.emailPreview && (
                                    <div className="mt-2">
                                        <a href={success.emailPreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                                            View email preview
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs pt-2 text-green-700 bg-green-100 p-2 rounded">
                                Share the temporary password with the new admin. They should change it on first login.
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Alert */}
            {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
            )}

            {/* Form Card */}
            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email Address *
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
                            disabled={loading}
                            required
                            autoComplete="off"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            The email address for the new admin user
                        </p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                            Name (Optional)
                        </label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            disabled={loading}
                            autoComplete="off"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Display name for the admin user
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Admin'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/admin')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {/* Helper Text */}
                <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-3">Important Notes:</h3>
                    <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                        <li>A temporary password will be generated automatically</li>
                        <li>Share the temporary password with the new admin securely</li>
                        <li>The new admin must change their password on first login</li>
                        <li>Only existing admins can create new admin accounts</li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}
