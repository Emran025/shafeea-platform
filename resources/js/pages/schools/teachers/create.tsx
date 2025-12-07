import React from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
    errors: Record<string, string>;
}

const CreateTeacher = () => {
  const { errors } = usePage<PageProps>().props;
  const { data, setData, post, processing } = useForm({
    'user.name': '',
    'user.email': '',
    'user.avatar': '',
    'user.gender': '',
    'user.birthDate': '',
    'user.phoneZone': '',
    'user.phone': '',
    'user.whatsappZone': '',
    'user.whatsapp': '',
    'user.country': '',
    'user.residence': '',
    'user.city': '',
    'user.status': 'active',
    bio: '',
    experience_years: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/schools/teachers');
  };

  return (
    <div className="container mx-auto py-8 px-2" dir="rtl">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur mb-6 flex items-center gap-2 py-2 px-2 rounded shadow-sm">
        <Link href="/schools/teachers">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-2xl font-bold">إنشاء معلم</h1>
      </div>
      <form className="bg-white shadow rounded-xl p-6 max-w-2xl mx-auto space-y-4 transition-all duration-300" onSubmit={handleSubmit}>
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <ul className="list-disc pl-5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" type="text" value={data['user.name']} onChange={e => setData('user.name', e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" value={data['user.email']} onChange={e => setData('user.email', e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="avatar">رابط الصورة</Label>
            <Input id="avatar" type="text" value={data['user.avatar']} onChange={e => setData('user.avatar', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="gender">الجنس</Label>
            <Select value={data['user.gender']} onValueChange={v => setData('user.gender', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">ذكر</SelectItem>
                <SelectItem value="Female">أنثى</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="birthDate">تاريخ الميلاد</Label>
            <Input id="birthDate" type="date" value={data['user.birthDate']} onChange={e => setData('user.birthDate', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phoneZone">رمز الهاتف</Label>
            <Input id="phoneZone" type="text" value={data['user.phoneZone']} onChange={e => setData('user.phoneZone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input id="phone" type="text" value={data['user.phone']} onChange={e => setData('user.phone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="whatsappZone">رمز الواتساب</Label>
            <Input id="whatsappZone" type="text" value={data['user.whatsappZone']} onChange={e => setData('user.whatsappZone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="whatsapp">الواتساب</Label>
            <Input id="whatsapp" type="text" value={data['user.whatsapp']} onChange={e => setData('user.whatsapp', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="country">البلد</Label>
            <Input id="country" type="text" value={data['user.country']} onChange={e => setData('user.country', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="residence">المسكن</Label>
            <Input id="residence" type="text" value={data['user.residence']} onChange={e => setData('user.residence', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="city">المدينة</Label>
            <Input id="city" type="text" value={data['user.city']} onChange={e => setData('user.city', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="status">الحالة</Label>
            <Select value={data['user.status']} onValueChange={v => setData('user.status', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
                <SelectItem value="suspended">معلق</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="bio">السيرة الذاتية</Label>
          <textarea id="bio" className="w-full border rounded px-3 py-2 min-h-[80px]" value={data.bio} onChange={e => setData('bio', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="experience_years">سنوات الخبرة</Label>
          <Input id="experience_years" type="number" value={data.experience_years} onChange={e => setData('experience_years', e.target.value)} />
        </div>
        <div className="flex justify-between gap-2 mt-6">
          <Link href="/schools/teachers" className="w-full md:w-auto">
            <Button type="button" variant="secondary" className="w-full md:w-auto">إلغاء</Button>
          </Link>
          <Button type="submit" disabled={processing} className="w-full md:w-auto">إنشاء</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeacher;
