import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SiteLayout from '@/layouts/site-layout';

export default function Apply() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        bio: '',
        qualifications: null as File | null,
        intent_statement: null as File | null,
        memorization_level: 0,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('teachers.store'));
    }

    return (
        <SiteLayout>
            <Head title="Contribute as a Teacher" />
            <div className="container mx-auto py-12">
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Contribute as a Teacher</CardTitle>
                        <CardDescription>Fill out the form below to apply as a teacher.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.name && <div className="text-red-500 mt-2">{errors.name}</div>}
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.email && <div className="text-red-500 mt-2">{errors.email}</div>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.password && <div className="text-red-500 mt-2">{errors.password}</div>}
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.bio && <div className="text-red-500 mt-2">{errors.bio}</div>}
                            </div>
                            <div>
                                <Label htmlFor="qualifications">Qualifications</Label>
                                <Input
                                    id="qualifications"
                                    type="file"
                                    onChange={(e) => setData('qualifications', e.target.files ? e.target.files[0] : null)}
                                    className="mt-1 block w-full"
                                />
                                {errors.qualifications && <div className="text-red-500 mt-2">{errors.qualifications}</div>}
                            </div>
                            <div>
                                <Label htmlFor="intent_statement">Statement of Intent</Label>
                                <Input
                                    id="intent_statement"
                                    type="file"
                                    onChange={(e) => setData('intent_statement', e.target.files ? e.target.files[0] : null)}
                                    className="mt-1 block w-full"
                                />
                                {errors.intent_statement && <div className="text-red-500 mt-2">{errors.intent_statement}</div>}
                            </div>
                            <div>
                                <Label htmlFor="memorization_level">Memorization Level (Juz')</Label>
                                <Input
                                    id="memorization_level"
                                    type="number"
                                    value={data.memorization_level}
                                    onChange={(e) => setData('memorization_level', parseInt(e.target.value, 10))}
                                    className="mt-1 block w-full"
                                />
                                {errors.memorization_level && <div className="text-red-500 mt-2">{errors.memorization_level}</div>}
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
