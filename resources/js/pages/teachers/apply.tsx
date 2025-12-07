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
        bio: '',
        qualifications: '',
        intent_statement: '',
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
                                <Textarea
                                    id="qualifications"
                                    value={data.qualifications}
                                    onChange={(e) => setData('qualifications', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                {errors.qualifications && <div className="text-red-500 mt-2">{errors.qualifications}</div>}
                            </div>
                            <div>
                                <Label htmlFor="intent_statement">Statement of Intent</Label>
                                <Textarea
                                    id="intent_statement"
                                    value={data.intent_statement}
                                    onChange={(e) => setData('intent_statement', e.target.value)}
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
