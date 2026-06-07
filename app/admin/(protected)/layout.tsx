import AdminSidebar from '@/components/AdminSidebar'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>{children}</div>
    </div>
  )
}
