import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, User, Eye, Trash2, Edit, Download, Filter } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
// import { motion, AnimatePresence } from 'framer-motion'; // Uncomment if framer-motion is installed

const TeachersIndex = () => {
  const { teachers, flash } = usePage().props as any;
  const [search, setSearch] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [page, setPage] = useState(teachers?.current_page || 1);
  const [selected, setSelected] = useState<number[]>([]);
  const [quickView, setQuickView] = useState<any | null>(null);

  // Filtered teachers
  const filteredTeachers = (teachers?.data || [])
    .filter((teacher: any) =>
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((teacher: any) =>
      experienceFilter !== 'all' ? String(teacher.experienceYears) === experienceFilter : true
    )
    .filter((teacher: any) =>
      statusFilter !== 'all' ? teacher.status === statusFilter : true
    )
    .filter((teacher: any) =>
      genderFilter !== 'all' ? teacher.gender === genderFilter : true
    );

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
      // Implement delete logic
    }
  };

  const handleBulkDelete = () => {
    if (selected.length && confirm('هل أنت متأكد من حذف المعلمين المحددين؟')) {
      // Implement bulk delete logic
    }
  };

  const handleExport = () => {
    // Export filteredTeachers to CSV
    const csv = [
      ['الاسم', 'البريد الإلكتروني', 'الجنس', 'الخبرة', 'الحالة'],
      ...filteredTeachers.map((t: any) => [t.name, t.email, t.gender, t.experienceYears, t.status])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination logic
  const totalPages = teachers?.last_page || 1;
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      // Optionally, fetch new page from server if paginated
    }
  };

  const handleSelect = (id: number) => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === filteredTeachers.length) setSelected([]);
    else setSelected(filteredTeachers.map((t: any) => t.id));
  };

  // Responsive card/table hybrid for mobile
  return (
    <div className="container mx-auto py-8" dir="rtl">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">المعلمين</h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <Input
            type="text"
            placeholder="البحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="جميع الخبرات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الخبرات</SelectItem>
              {[...new Set((teachers?.data || []).map((t: any) => t.experienceYears))]
                .filter(Boolean)
                .map((exp: any) => (
                  <SelectItem key={exp} value={String(exp)}>{exp} سنوات</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="جميع الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
              <SelectItem value="suspended">معلق</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="جميع الأجناس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأجناس</SelectItem>
              <SelectItem value="Male">ذكر</SelectItem>
              <SelectItem value="Female">أنثى</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport} title="تصدير إلى CSV" className="flex items-center gap-1"><Download className="w-4 h-4" />تصدير</Button>
          <Link href="/schools/teachers/create">
            <Button variant="default">إنشاء معلم</Button>
          </Link>
        </div>
      </div>
      {flash?.success && (
        <Alert className="mb-4" variant="default">{flash.success}</Alert>
      )}
      <div className="bg-white shadow rounded p-2 md:p-4 overflow-x-auto transition-all duration-300">
        {filteredTeachers.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" disabled={!selected.length} onClick={handleBulkDelete} className="transition-all duration-200"><Trash2 className="w-4 h-4" />حذف متعدد</Button>
                <span className="text-xs text-gray-500">{selected.length} محدد</span>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">الفلاتر المطبقة: {[
                  experienceFilter !== 'all' && `الخبرة: ${experienceFilter}`,
                  statusFilter !== 'all' && `الحالة: ${statusFilter}`,
                  genderFilter !== 'all' && `الجنس: ${genderFilter}`
                ].filter(Boolean).join(', ') || 'لا شيء'}</span>
              </div>
            </div>
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input type="checkbox" checked={selected.length === filteredTeachers.length && filteredTeachers.length > 0} onChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead className="hidden md:table-cell">الجنس</TableHead>
                  <TableHead className="hidden md:table-cell">الخبرة</TableHead>
                  <TableHead className="hidden md:table-cell">الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher: any) => (
                  <TableRow key={teacher.id} className={
                    `hover:bg-indigo-50 transition-all duration-200 ${selected.includes(teacher.id) ? 'bg-indigo-100' : ''}`
                  }>
                    <TableCell>
                      <input type="checkbox" checked={selected.includes(teacher.id)} onChange={() => handleSelect(teacher.id)} />
                    </TableCell>
                    <TableCell>
                      {teacher.avatar ? (
                        <img src={teacher.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow transition-transform duration-200 hover:scale-110" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                      <span>{teacher.name}</span>
                      <Button variant="ghost" size="icon" title="عرض سريع" onClick={() => setQuickView(teacher)} className="hover:bg-indigo-100 transition-all duration-200"><Eye className="w-4 h-4" /></Button>
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{teacher.gender || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{teacher.experienceYears ?? '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}
                        className={teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {teacher.status === 'active' ? 'نشط' : teacher.status || 'غير نشط'}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-1 flex flex-wrap">
                      <Link href={`/schools/teachers/${teacher.id}`} title="عرض">
                        <Button variant="link" size="sm" className="hover:bg-indigo-100 transition-all duration-200"><Eye className="w-4 h-4" /></Button>
                      </Link>
                      <Link href={`/schools/teachers/${teacher.id}/edit`} title="تعديل">
                        <Button variant="secondary" size="sm" className="hover:bg-indigo-100 transition-all duration-200"><Edit className="w-4 h-4" /></Button>
                      </Link>
                      <Button variant="destructive" size="sm" title="حذف" onClick={() => handleDelete(teacher.id)} className="hover:bg-red-200 transition-all duration-200">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button variant="ghost" size="icon" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm">الصفحة {page} من {totalPages}</span>
                <Button variant="ghost" size="icon" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
            {/* Quick View Modal */}
            {quickView && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-300" onClick={() => setQuickView(null)}>
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 animate-fadeInUp" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">تفاصيل المعلم</h2>
                    <Button variant="ghost" size="icon" onClick={() => setQuickView(null)}>&times;</Button>
                  </div>
                  <div className="flex flex-col items-center gap-2 mb-4">
                    {quickView.avatar ? (
                      <img src={quickView.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover shadow" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="font-semibold text-lg">{quickView.name}</div>
                    <div className="text-gray-500">{quickView.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                    <div><span className="font-semibold">الجنس:</span> {quickView.gender || '-'}</div>
                    <div><span className="font-semibold">الخبرة:</span> {quickView.experienceYears ?? '-'}</div>
                    <div><span className="font-semibold">الحالة:</span> {quickView.status || '-'}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2"><span className="font-semibold">السيرة:</span> {quickView.bio || '-'}</div>
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => setQuickView(null)}>إغلاق</Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">لم يتم العثور على معلمين.</p>
        )}
      </div>
    </div>
  );
};

export default TeachersIndex;

// Tailwind animation (add to your global CSS if not present):
// .animate-fadeInUp { animation: fadeInUp 0.3s ease; }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
