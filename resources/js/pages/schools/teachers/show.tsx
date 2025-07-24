import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const ShowTeacher = () => {
  const { teacher, students } = usePage().props as any;

  return (
    <div className="container mx-auto py-8 px-2" dir="rtl">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="flex flex-col items-center bg-gradient-to-r from-indigo-50 to-purple-50 pb-0">
          <div className="flex flex-col items-center w-full">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow mb-4 mt-2 overflow-hidden">
              {teacher.avatar ? (
                <img src={teacher.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-gray-300">👤</span>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center mb-1">{teacher.name}</CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge variant="outline" className="text-xs px-2 py-1">{teacher.gender || '-'}</Badge>
              <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className={teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>{teacher.status || '-'}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-6 px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div><span className="font-semibold">البريد الإلكتروني:</span> <span className="text-gray-700">{teacher.email}</span></div>
            <div><span className="font-semibold">تاريخ الميلاد:</span> <span className="text-gray-700">{teacher.birthDate || '-'}</span></div>
            <div><span className="font-semibold">رمز الهاتف:</span> <span className="text-gray-700">{teacher.phoneZone || '-'}</span></div>
            <div><span className="font-semibold">الهاتف:</span> <span className="text-gray-700">{teacher.phone || '-'}</span></div>
            <div><span className="font-semibold">رمز الواتساب:</span> <span className="text-gray-700">{teacher.whatsappZone || '-'}</span></div>
            <div><span className="font-semibold">الواتساب:</span> <span className="text-gray-700">{teacher.whatsapp || '-'}</span></div>
            <div><span className="font-semibold">البلد:</span> <span className="text-gray-700">{teacher.country || '-'}</span></div>
            <div><span className="font-semibold">المسكن:</span> <span className="text-gray-700">{teacher.residence || '-'}</span></div>
            <div><span className="font-semibold">المدينة:</span> <span className="text-gray-700">{teacher.city || '-'}</span></div>
            <div><span className="font-semibold">سنوات الخبرة:</span> <span className="text-gray-700">{teacher.experienceYears || '-'}</span></div>
          </div>
          <div className="mt-6">
            <span className="font-semibold">السيرة الذاتية:</span>
            <div className="text-gray-700 mt-1 whitespace-pre-line bg-gray-50 rounded p-3 text-sm shadow-inner">{teacher.bio || '-'}</div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row justify-between gap-2 px-4 pb-6">
          <Link href="/schools/teachers" className="w-full md:w-auto">
            <Button variant="secondary" className="w-full md:w-auto flex items-center gap-2"><ArrowLeft className="w-4 h-4" />العودة للقائمة</Button>
          </Link>
          <Link href={`/schools/teachers/${teacher.id}/edit`} className="w-full md:w-auto">
            <Button variant="default" className="w-full md:w-auto flex items-center gap-2"><Edit2 className="w-4 h-4" />تعديل</Button>
          </Link>
        </CardFooter>
      </Card>
      {/* Students Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4">الطلاب المسندين</h2>
        {students && students.length > 0 ? (
          <div className="overflow-x-auto rounded shadow bg-white">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead className="hidden md:table-cell">الجنس</TableHead>
                  <TableHead className="hidden md:table-cell">الحالة</TableHead>
                  <TableHead className="hidden md:table-cell">المدينة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student: any) => (
                  <TableRow key={student.id} className="hover:bg-indigo-50 transition-all duration-200">
                    <TableCell>
                      {student.avatar ? (
                        <img src={student.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg text-gray-400">👤</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.gender || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.status || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{student.city || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8 bg-white rounded shadow">لا يوجد طلاب مسندين لهذا المعلم.</div>
        )}
      </div>
    </div>
  );
};

export default ShowTeacher;
