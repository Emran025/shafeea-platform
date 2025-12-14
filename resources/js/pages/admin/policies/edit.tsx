import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageProps, TermsOfUse, PrivacyPolicy } from '@/types';
import { PlusCircle, Trash2 } from 'lucide-react';

interface EditPolicyProps extends PageProps {
    policy: PrivacyPolicy | TermsOfUse;
    type: 'policy' | 'term';
}

interface Section {
    title: string;
    content: string[];
}

export default function EditPolicy() {
    const { policy, type } = usePage<EditPolicyProps>().props;
    const { data, setData, post, errors } = useForm({
        sections: JSON.parse(policy.sections_json) as Section[],
    });

    const handleSectionChange = (index: number, field: 'title' | 'content', value: string | string[]) => {
        const updatedSections = [...data.sections];
        updatedSections[index] = { ...updatedSections[index], [field]: value };
        setData('sections', updatedSections);
    };

    const handleContentChange = (sectionIndex: number, contentIndex: number, value: string) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].content[contentIndex] = value;
        handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
    };

    const addSection = () => {
        setData('sections', [...data.sections, { title: '', content: [''] }]);
    };

    const removeSection = (index: number) => {
        const updatedSections = data.sections.filter((_, i) => i !== index);
        setData('sections', updatedSections);
    };

    const addContent = (sectionIndex: number) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].content.push('');
        handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
    };

    const removeContent = (sectionIndex: number, contentIndex: number) => {
        const updatedSections = [...data.sections];
        updatedSections[sectionIndex].content = updatedSections[sectionIndex].content.filter((_, i) => i !== contentIndex);
        handleSectionChange(sectionIndex, 'content', updatedSections[sectionIndex].content);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/policies/update/${type}/${policy.version}`);
    };


	 
    return (
        <AdminLayout>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Edit {type === 'policy' ? 'Privacy Policy' : 'Terms of Use'}
                </h1>

                <form onSubmit={handleSubmit} className="mt-8">
                    <Card className="p-6">
                        {data.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-6 p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <Input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                                        className="text-lg font-semibold"
                                        placeholder="Section Title"
                                    />
                                    <Button type="button" variant="destructive" size="sm" onClick={() => removeSection(sectionIndex)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                {section.content.map((item, contentIndex) => (
                                    <div key={contentIndex} className="flex items-center gap-2 mb-2">
                                        <Textarea
                                            value={item}
                                            onChange={(e) => handleContentChange(sectionIndex, contentIndex, e.target.value)}
                                            className="w-full"
                                            placeholder="Section Detail"
                                        />
                                        <Button type="button" variant="destructive" size="sm" onClick={() => removeContent(sectionIndex, contentIndex)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => addContent(sectionIndex)}>
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Add Detail
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={addSection}>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Section
                        </Button>
                    </Card>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
