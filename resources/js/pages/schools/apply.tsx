import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SiteLayout from '@/layouts/site-layout';

export default function Apply() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        logo: '',
        phone: '',
        country: '',
        city: '',
        location: '',
        address: '',
        admin_name: '',
        admin_email: '',
        admin_phone: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('schools.store'));
    }

    return (
        <SiteLayout>
            <Head title="Register as a School" />
            <div className="container mx-auto py-12">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Register as a School</CardTitle>
                        <CardDescription>Fill out the form below to register your school.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">School Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.name && <div className="text-red-500 mt-2">{errors.name}</div>}
                            </div>
                            <div>
                                <Label htmlFor="logo">Logo URL</Label>
                                <Input
                                    id="logo"
                                    value={data.logo}
                                    onChange={(e) => setData('logo', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.logo && <div className="text-red-500 mt-2">{errors.logo}</div>}
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.phone && <div className="text-red-500 mt-2">{errors.phone}</div>}
                            </div>
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.country && <div className="text-red-500 mt-2">{errors.country}</div>}
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.city && <div className="text-red-500 mt-2">{errors.city}</div>}
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.location && <div className="text-red-500 mt-2">{errors.location}</div>}
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.address && <div className="text-red-500 mt-2">{errors.address}</div>}
                            </div>

                            <hr />

                            <h2 className="text-xl font-semibold">Admin User Information</h2>

                            <div>
                                <Label htmlFor="admin_name">Admin Name</Label>
                                <Input
                                    id="admin_name"
                                    value={data.admin_name}
                                    onChange={(e) => setData('admin_name', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.admin_name && <div className="text-red-500 mt-2">{errors.admin_name}</div>}
                            </div>

                            <div>
                                <Label htmlFor="admin_email">Admin Email</Label>
                                <Input
                                    id="admin_email"
                                    type="email"
                                    value={data.admin_email}
                                    onChange={(e) => setData('admin_email', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.admin_email && <div className="text-red-500 mt-2">{errors.admin_email}</div>}
                            </div>

                            <div>
                                <Label htmlFor="admin_phone">Admin Phone</Label>
                                <Input
                                    id="admin_phone"
                                    value={data.admin_phone}
                                    onChange={(e) => setData('admin_phone', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.admin_phone && <div className="text-red-500 mt-2">{errors.admin_phone}</div>}
                            </div>

                            <div>
                                <Label htmlFor="admin_password">Admin Password</Label>
                                <Input
                                    id="admin_password"
                                    type="password"
                                    value={data.admin_password}
                                    onChange={(e) => setData('admin_password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.admin_password && (
                                    <div className="text-red-500 mt-2">{errors.admin_password}</div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="admin_password_confirmation">Confirm Admin Password</Label>
                                <Input
                                    id="admin_password_confirmation"
                                    type="password"
                                    value={data.admin_password_confirmation}
                                    onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>

                            <div className="flex items-center justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </SiteLayout>
    );
}
