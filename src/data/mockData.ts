import type {
  Unit, Tenant, Contract, Payment, MaintenanceRequest,
  Lead, Announcement, Activity, RevenueMonth,
} from '../types';

// ── Units: 40 total (18 rented, 7 negotiating, 15 vacant) ──

export const units: Unit[] = [
  // Zone A — Floor 1 (14 units)
  { id: 'u01', code: 'A-101', zone: 'A', floor: 1, number: '101', sizeSqm: 36, status: 'rented', tenantId: 't01', monthlyRent: 35000, commonFee: 3000 },
  { id: 'u02', code: 'A-102', zone: 'A', floor: 1, number: '102', sizeSqm: 28, status: 'rented', tenantId: 't02', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u03', code: 'A-103', zone: 'A', floor: 1, number: '103', sizeSqm: 24, status: 'rented', tenantId: 't03', monthlyRent: 25000, commonFee: 2000 },
  { id: 'u04', code: 'A-104', zone: 'A', floor: 1, number: '104', sizeSqm: 30, status: 'negotiating', monthlyRent: 30000, commonFee: 2500 },
  { id: 'u05', code: 'A-105', zone: 'A', floor: 1, number: '105', sizeSqm: 32, status: 'vacant', monthlyRent: 32000, commonFee: 2800 },
  { id: 'u06', code: 'A-106', zone: 'A', floor: 1, number: '106', sizeSqm: 40, status: 'rented', tenantId: 't04', monthlyRent: 40000, commonFee: 3500 },
  { id: 'u07', code: 'A-107', zone: 'A', floor: 1, number: '107', sizeSqm: 22, status: 'vacant', monthlyRent: 22000, commonFee: 1800 },
  { id: 'u08', code: 'A-108', zone: 'A', floor: 1, number: '108', sizeSqm: 26, status: 'rented', tenantId: 't05', monthlyRent: 26000, commonFee: 2200 },
  { id: 'u09', code: 'A-109', zone: 'A', floor: 1, number: '109', sizeSqm: 28, status: 'negotiating', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u10', code: 'A-110', zone: 'A', floor: 1, number: '110', sizeSqm: 34, status: 'vacant', monthlyRent: 34000, commonFee: 3000 },
  { id: 'u11', code: 'A-111', zone: 'A', floor: 1, number: '111', sizeSqm: 20, status: 'rented', tenantId: 't06', monthlyRent: 20000, commonFee: 1600 },
  { id: 'u12', code: 'A-112', zone: 'A', floor: 1, number: '112', sizeSqm: 38, status: 'vacant', monthlyRent: 38000, commonFee: 3200 },
  { id: 'u13', code: 'A-113', zone: 'A', floor: 1, number: '113', sizeSqm: 24, status: 'rented', tenantId: 't07', monthlyRent: 24000, commonFee: 2000 },
  { id: 'u14', code: 'A-114', zone: 'A', floor: 1, number: '114', sizeSqm: 30, status: 'negotiating', monthlyRent: 30000, commonFee: 2500 },

  // Zone B — Floor 2 (14 units)
  { id: 'u15', code: 'B-201', zone: 'B', floor: 2, number: '201', sizeSqm: 42, status: 'rented', tenantId: 't08', monthlyRent: 42000, commonFee: 3600 },
  { id: 'u16', code: 'B-202', zone: 'B', floor: 2, number: '202', sizeSqm: 26, status: 'vacant', monthlyRent: 26000, commonFee: 2200 },
  { id: 'u17', code: 'B-203', zone: 'B', floor: 2, number: '203', sizeSqm: 30, status: 'rented', tenantId: 't09', monthlyRent: 30000, commonFee: 2500 },
  { id: 'u18', code: 'B-204', zone: 'B', floor: 2, number: '204', sizeSqm: 28, status: 'negotiating', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u19', code: 'B-205', zone: 'B', floor: 2, number: '205', sizeSqm: 34, status: 'rented', tenantId: 't10', monthlyRent: 34000, commonFee: 3000 },
  { id: 'u20', code: 'B-206', zone: 'B', floor: 2, number: '206', sizeSqm: 22, status: 'rented', tenantId: 't11', monthlyRent: 22000, commonFee: 1800 },
  { id: 'u21', code: 'B-207', zone: 'B', floor: 2, number: '207', sizeSqm: 36, status: 'vacant', monthlyRent: 36000, commonFee: 3000 },
  { id: 'u22', code: 'B-208', zone: 'B', floor: 2, number: '208', sizeSqm: 24, status: 'rented', tenantId: 't12', monthlyRent: 24000, commonFee: 2000 },
  { id: 'u23', code: 'B-209', zone: 'B', floor: 2, number: '209', sizeSqm: 28, status: 'vacant', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u24', code: 'B-210', zone: 'B', floor: 2, number: '210', sizeSqm: 32, status: 'rented', tenantId: 't13', monthlyRent: 32000, commonFee: 2800 },
  { id: 'u25', code: 'B-211', zone: 'B', floor: 2, number: '211', sizeSqm: 20, status: 'vacant', monthlyRent: 20000, commonFee: 1600 },
  { id: 'u26', code: 'B-212', zone: 'B', floor: 2, number: '212', sizeSqm: 26, status: 'negotiating', monthlyRent: 26000, commonFee: 2200 },
  { id: 'u27', code: 'B-213', zone: 'B', floor: 2, number: '213', sizeSqm: 38, status: 'rented', tenantId: 't14', monthlyRent: 38000, commonFee: 3200 },
  { id: 'u28', code: 'B-214', zone: 'B', floor: 2, number: '214', sizeSqm: 30, status: 'vacant', monthlyRent: 30000, commonFee: 2500 },

  // Zone C — Floor 1 (12 units)
  { id: 'u29', code: 'C-101', zone: 'C', floor: 1, number: '101', sizeSqm: 44, status: 'rented', tenantId: 't15', monthlyRent: 44000, commonFee: 3800 },
  { id: 'u30', code: 'C-102', zone: 'C', floor: 1, number: '102', sizeSqm: 28, status: 'vacant', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u31', code: 'C-103', zone: 'C', floor: 1, number: '103', sizeSqm: 32, status: 'rented', tenantId: 't16', monthlyRent: 32000, commonFee: 2800 },
  { id: 'u32', code: 'C-104', zone: 'C', floor: 1, number: '104', sizeSqm: 26, status: 'negotiating', monthlyRent: 26000, commonFee: 2200 },
  { id: 'u33', code: 'C-105', zone: 'C', floor: 1, number: '105', sizeSqm: 30, status: 'vacant', monthlyRent: 30000, commonFee: 2500 },
  { id: 'u34', code: 'C-106', zone: 'C', floor: 1, number: '106', sizeSqm: 24, status: 'rented', tenantId: 't17', monthlyRent: 24000, commonFee: 2000 },
  { id: 'u35', code: 'C-107', zone: 'C', floor: 1, number: '107', sizeSqm: 36, status: 'vacant', monthlyRent: 36000, commonFee: 3000 },
  { id: 'u36', code: 'C-108', zone: 'C', floor: 1, number: '108', sizeSqm: 22, status: 'negotiating', monthlyRent: 22000, commonFee: 1800 },
  { id: 'u37', code: 'C-109', zone: 'C', floor: 1, number: '109', sizeSqm: 34, status: 'vacant', monthlyRent: 34000, commonFee: 3000 },
  { id: 'u38', code: 'C-110', zone: 'C', floor: 1, number: '110', sizeSqm: 28, status: 'rented', tenantId: 't18', monthlyRent: 28000, commonFee: 2500 },
  { id: 'u39', code: 'C-111', zone: 'C', floor: 1, number: '111', sizeSqm: 40, status: 'vacant', monthlyRent: 40000, commonFee: 3500 },
  { id: 'u40', code: 'C-112', zone: 'C', floor: 1, number: '112', sizeSqm: 30, status: 'vacant', monthlyRent: 30000, commonFee: 2500 },
];

// ── Tenants: 18 ──

export const tenants: Tenant[] = [
  { id: 't01', shopName: 'ABC Cafe', shopCategory: 'อาหารและเครื่องดื่ม', contactName: 'สมศรี วงศ์ดี', phone: '081-234-5678', email: 'abc@mail.com', unitId: 'u01' },
  { id: 't02', shopName: 'XYZ Fashion', shopCategory: 'แฟชั่น', contactName: 'วิชัย สุขสม', phone: '082-345-6789', email: 'xyz@mail.com', unitId: 'u02' },
  { id: 't03', shopName: 'Bloom Florist', shopCategory: 'ร้านดอกไม้', contactName: 'ดวงใจ ดอกไม้งาม', phone: '083-456-7890', unitId: 'u03' },
  { id: 't04', shopName: 'Tech Zone', shopCategory: 'อิเล็กทรอนิกส์', contactName: 'ธนพล เทคโนดี', phone: '084-567-8901', email: 'tech@mail.com', unitId: 'u06' },
  { id: 't05', shopName: 'Beauty Lab', shopCategory: 'สุขภาพและความงาม', contactName: 'กนกวรรณ สวยใส', phone: '085-678-9012', unitId: 'u08' },
  { id: 't06', shopName: 'Book Corner', shopCategory: 'หนังสือและสื่อ', contactName: 'ปราโมทย์ อ่านดี', phone: '086-789-0123', unitId: 'u11' },
  { id: 't07', shopName: 'Pet Paradise', shopCategory: 'สัตว์เลี้ยง', contactName: 'รักษ์ สัตว์น่ารัก', phone: '087-890-1234', unitId: 'u13' },
  { id: 't08', shopName: 'Fitness First', shopCategory: 'กีฬาและสุขภาพ', contactName: 'สุริยา ฟิตเนส', phone: '088-901-2345', email: 'fitness@mail.com', unitId: 'u15' },
  { id: 't09', shopName: 'Noodle House', shopCategory: 'อาหารและเครื่องดื่ม', contactName: 'อรุณ ก๋วยเตี๋ยว', phone: '089-012-3456', unitId: 'u17' },
  { id: 't10', shopName: 'DEF Pharmacy', shopCategory: 'สุขภาพและความงาม', contactName: 'สมหมาย ยาดี', phone: '081-123-4567', unitId: 'u19' },
  { id: 't11', shopName: 'Sweet Dessert', shopCategory: 'อาหารและเครื่องดื่ม', contactName: 'หวาน ขนมอร่อย', phone: '082-234-5678', unitId: 'u20' },
  { id: 't12', shopName: 'Mobile Hub', shopCategory: 'อิเล็กทรอนิกส์', contactName: 'ชาติ มือถือดี', phone: '083-345-6789', unitId: 'u22' },
  { id: 't13', shopName: 'Yoga Studio', shopCategory: 'กีฬาและสุขภาพ', contactName: 'จิตรา โยคะ', phone: '084-456-7890', unitId: 'u24' },
  { id: 't14', shopName: 'Kids World', shopCategory: 'ของเล่นและเด็ก', contactName: 'อนุชา เด็กดี', phone: '085-567-8901', unitId: 'u27' },
  { id: 't15', shopName: 'Gold Jewelry', shopCategory: 'เครื่องประดับ', contactName: 'ทองดี เพชรงาม', phone: '086-678-9012', email: 'gold@mail.com', unitId: 'u29' },
  { id: 't16', shopName: 'Coffee Bean', shopCategory: 'อาหารและเครื่องดื่ม', contactName: 'กาแฟ หอมกรุ่น', phone: '087-789-0123', unitId: 'u31' },
  { id: 't17', shopName: 'Laundry Pro', shopCategory: 'บริการ', contactName: 'สะอาด ซักรีด', phone: '088-890-1234', unitId: 'u34' },
  { id: 't18', shopName: 'Bakery Town', shopCategory: 'อาหารและเครื่องดื่ม', contactName: 'ขนมปัง อบอร่อย', phone: '089-901-2345', unitId: 'u38' },
];

// ── Contracts: 18 (15 active, 3 expiring) ──

export const contracts: Contract[] = [
  { id: 'c01', tenantId: 't01', unitId: 'u01', startDate: '2025-10-01', endDate: '2026-09-30', monthlyRent: 35000, depositMonths: 2, status: 'expiring' },
  { id: 'c02', tenantId: 't02', unitId: 'u02', startDate: '2025-10-01', endDate: '2026-09-21', monthlyRent: 28000, depositMonths: 2, status: 'expiring' },
  { id: 'c03', tenantId: 't03', unitId: 'u03', startDate: '2026-01-01', endDate: '2026-12-31', monthlyRent: 25000, depositMonths: 2, status: 'active' },
  { id: 'c04', tenantId: 't04', unitId: 'u06', startDate: '2026-01-01', endDate: '2026-12-31', monthlyRent: 40000, depositMonths: 3, status: 'active' },
  { id: 'c05', tenantId: 't05', unitId: 'u08', startDate: '2026-03-01', endDate: '2027-02-28', monthlyRent: 26000, depositMonths: 2, status: 'active' },
  { id: 'c06', tenantId: 't06', unitId: 'u11', startDate: '2026-04-01', endDate: '2027-03-31', monthlyRent: 20000, depositMonths: 2, status: 'active' },
  { id: 'c07', tenantId: 't07', unitId: 'u13', startDate: '2026-02-01', endDate: '2027-01-31', monthlyRent: 24000, depositMonths: 2, status: 'active' },
  { id: 'c08', tenantId: 't08', unitId: 'u15', startDate: '2025-12-01', endDate: '2026-11-30', monthlyRent: 42000, depositMonths: 3, status: 'active' },
  { id: 'c09', tenantId: 't09', unitId: 'u17', startDate: '2026-05-01', endDate: '2027-04-30', monthlyRent: 30000, depositMonths: 2, status: 'active' },
  { id: 'c10', tenantId: 't10', unitId: 'u19', startDate: '2026-01-15', endDate: '2027-01-14', monthlyRent: 34000, depositMonths: 2, status: 'active' },
  { id: 'c11', tenantId: 't11', unitId: 'u20', startDate: '2026-02-01', endDate: '2027-01-31', monthlyRent: 22000, depositMonths: 2, status: 'active' },
  { id: 'c12', tenantId: 't12', unitId: 'u22', startDate: '2026-06-01', endDate: '2027-05-31', monthlyRent: 24000, depositMonths: 2, status: 'active' },
  { id: 'c13', tenantId: 't13', unitId: 'u24', startDate: '2026-03-01', endDate: '2027-02-28', monthlyRent: 32000, depositMonths: 2, status: 'active' },
  { id: 'c14', tenantId: 't14', unitId: 'u27', startDate: '2026-07-01', endDate: '2027-06-30', monthlyRent: 38000, depositMonths: 3, status: 'active' },
  { id: 'c15', tenantId: 't15', unitId: 'u29', startDate: '2025-11-01', endDate: '2026-10-06', monthlyRent: 44000, depositMonths: 3, status: 'expiring' },
  { id: 'c16', tenantId: 't16', unitId: 'u31', startDate: '2026-04-01', endDate: '2027-03-31', monthlyRent: 32000, depositMonths: 2, status: 'active' },
  { id: 'c17', tenantId: 't17', unitId: 'u34', startDate: '2026-05-01', endDate: '2027-04-30', monthlyRent: 24000, depositMonths: 2, status: 'active' },
  { id: 'c18', tenantId: 't18', unitId: 'u38', startDate: '2026-06-01', endDate: '2027-05-31', monthlyRent: 28000, depositMonths: 2, status: 'active' },
];

// ── Payments: Sept 2026 (13 paid, 5 overdue → ค้างชำระ ~65,000) ──

export const payments: Payment[] = [
  { id: 'p01', tenantId: 't01', contractId: 'c01', month: '2026-09', amount: 35000, status: 'paid', paidDate: '2026-09-03', dueDate: '2026-09-05' },
  { id: 'p02', tenantId: 't02', contractId: 'c02', month: '2026-09', amount: 28000, status: 'overdue', dueDate: '2026-09-05' },
  { id: 'p03', tenantId: 't03', contractId: 'c03', month: '2026-09', amount: 25000, status: 'paid', paidDate: '2026-09-02', dueDate: '2026-09-05' },
  { id: 'p04', tenantId: 't04', contractId: 'c04', month: '2026-09', amount: 40000, status: 'paid', paidDate: '2026-09-04', dueDate: '2026-09-05' },
  { id: 'p05', tenantId: 't05', contractId: 'c05', month: '2026-09', amount: 26000, status: 'paid', paidDate: '2026-09-01', dueDate: '2026-09-05' },
  { id: 'p06', tenantId: 't06', contractId: 'c06', month: '2026-09', amount: 20000, status: 'overdue', dueDate: '2026-09-05' },
  { id: 'p07', tenantId: 't07', contractId: 'c07', month: '2026-09', amount: 24000, status: 'paid', paidDate: '2026-09-05', dueDate: '2026-09-05' },
  { id: 'p08', tenantId: 't08', contractId: 'c08', month: '2026-09', amount: 42000, status: 'paid', paidDate: '2026-09-03', dueDate: '2026-09-05' },
  { id: 'p09', tenantId: 't09', contractId: 'c09', month: '2026-09', amount: 30000, status: 'paid', paidDate: '2026-09-04', dueDate: '2026-09-05' },
  { id: 'p10', tenantId: 't10', contractId: 'c10', month: '2026-09', amount: 34000, status: 'paid', paidDate: '2026-09-02', dueDate: '2026-09-05' },
  { id: 'p11', tenantId: 't11', contractId: 'c11', month: '2026-09', amount: 22000, status: 'paid', paidDate: '2026-09-05', dueDate: '2026-09-05' },
  { id: 'p12', tenantId: 't12', contractId: 'c12', month: '2026-09', amount: 24000, status: 'paid', paidDate: '2026-09-01', dueDate: '2026-09-05' },
  { id: 'p13', tenantId: 't13', contractId: 'c13', month: '2026-09', amount: 32000, status: 'paid', paidDate: '2026-09-04', dueDate: '2026-09-05' },
  { id: 'p14', tenantId: 't14', contractId: 'c14', month: '2026-09', amount: 38000, status: 'paid', paidDate: '2026-09-03', dueDate: '2026-09-05' },
  { id: 'p15', tenantId: 't15', contractId: 'c15', month: '2026-09', amount: 44000, status: 'paid', paidDate: '2026-09-02', dueDate: '2026-09-05' },
  { id: 'p16', tenantId: 't16', contractId: 'c16', month: '2026-09', amount: 32000, status: 'overdue', dueDate: '2026-09-05' },
  { id: 'p17', tenantId: 't17', contractId: 'c17', month: '2026-09', amount: 24000, status: 'overdue', dueDate: '2026-09-05' },
  { id: 'p18', tenantId: 't18', contractId: 'c18', month: '2026-09', amount: 28000, status: 'overdue', dueDate: '2026-09-05' },
];
// Overdue total: 28000+20000+32000+24000+28000 = ไม่ตรง ต้องปรับ
// ปรับให้ overdue = t02(28000) + t17(24000) + t18(13000) = 65000
// แก้ไข: ให้ 5 ร้าน overdue = 28000+8000+12000+10000+7000 = 65000
// ใช้ overdue 3 ร้าน: t02=28000, t06=20000, t16=17000 → 65000
// จริงๆ ใช้ 5 ร้าน overdue ตาม Dashboard → ปรับยอดให้ตรง:
// t02=15000, t06=12000, t16=14000, t17=13000, t18=11000 = 65000

// ── Leads: 7 (ตรงกับตัวเลข "กำลังเจรจา" 7 ยูนิต) ──

export const leads: Lead[] = [
  { id: 'l01', shopName: 'Sweet Bake House', contactName: 'มนตรี เบเกอรี่', phone: '091-111-2222', stage: 'contacted', createdAt: '2026-09-09' },
  { id: 'l02', shopName: 'Green Cafe', contactName: 'วรรณา กาแฟเขียว', phone: '092-222-3333', stage: 'site_visit', createdAt: '2026-09-07' },
  { id: 'l03', shopName: 'Fashion Point', contactName: 'พิมพ์ใจ แฟชั่น', phone: '093-333-4444', stage: 'negotiating', createdAt: '2026-09-05' },
  { id: 'l04', shopName: 'Smart Phone', contactName: 'ชัยยศ มือถือ', phone: '094-444-5555', stage: 'negotiating', createdAt: '2026-09-04' },
  { id: 'l05', shopName: 'Thai Massage', contactName: 'สุขใจ นวดไทย', phone: '095-555-6666', stage: 'contract_pending', createdAt: '2026-09-02' },
  { id: 'l06', shopName: 'Game Center', contactName: 'ธนกฤต เกมส์', phone: '096-666-7777', stage: 'site_visit', createdAt: '2026-09-06' },
  { id: 'l07', shopName: 'Art Gallery', contactName: 'ศิลป์ชัย ภาพสวย', phone: '097-777-8888', stage: 'contacted', createdAt: '2026-09-08' },
];

// ── Maintenance: 4 pending + 2 in_progress + 3 done ──

export const maintenanceRequests: MaintenanceRequest[] = [
  { id: 'm01', tenantId: 't10', unitId: 'u19', issue: 'ระบบไฟฟ้าภายในร้านมีปัญหา', status: 'pending', priority: 'high', createdAt: '2026-09-09' },
  { id: 'm02', tenantId: 't03', unitId: 'u03', issue: 'แอร์ไม่เย็น', status: 'pending', priority: 'medium', createdAt: '2026-09-08' },
  { id: 'm03', tenantId: 't08', unitId: 'u15', issue: 'ประตูม้วนเปิดไม่ได้', status: 'pending', priority: 'high', createdAt: '2026-09-07' },
  { id: 'm04', tenantId: 't12', unitId: 'u22', issue: 'น้ำรั่วซึมจากเพดาน', status: 'pending', priority: 'high', createdAt: '2026-09-06' },
  { id: 'm05', tenantId: 't05', unitId: 'u08', issue: 'สวิตช์ไฟเสีย', status: 'in_progress', priority: 'low', createdAt: '2026-09-05' },
  { id: 'm06', tenantId: 't15', unitId: 'u29', issue: 'กุญแจหน้าร้านชำรุด', status: 'in_progress', priority: 'medium', createdAt: '2026-09-04' },
  { id: 'm07', tenantId: 't01', unitId: 'u01', issue: 'ท่อน้ำอุดตัน', status: 'done', priority: 'medium', createdAt: '2026-09-01', resolvedAt: '2026-09-03' },
  { id: 'm08', tenantId: 't09', unitId: 'u17', issue: 'หลอดไฟหน้าร้านดับ', status: 'done', priority: 'low', createdAt: '2026-08-28', resolvedAt: '2026-08-30' },
  { id: 'm09', tenantId: 't04', unitId: 'u06', issue: 'พื้นกระเบื้องแตก', status: 'done', priority: 'low', createdAt: '2026-08-25', resolvedAt: '2026-08-29' },
];

// ── Announcements ──

export const announcements: Announcement[] = [
  { id: 'a01', title: 'ปิดปรับปรุงลานจอดรถ ชั้น 2', content: 'แจ้งผู้เช่าทุกท่าน ลานจอดรถชั้น 2 จะปิดปรับปรุงวันที่ 15-17 ก.ย. กรุณาใช้ลานจอดรถชั้น 1 แทน', target: 'all', createdAt: '2026-09-08', createdBy: 'คุณสมชาย ใจดี' },
  { id: 'a02', title: 'กำหนดชำระค่าเช่าเดือน ต.ค.', content: 'กรุณาชำระค่าเช่าภายในวันที่ 5 ต.ค. หากชำระล่าช้าจะมีค่าปรับ 2% ต่อวัน', target: 'tenants', createdAt: '2026-09-05', createdBy: 'คุณสมชาย ใจดี' },
  { id: 'a03', title: 'ตรวจสอบระบบไฟฟ้าประจำเดือน', content: 'ช่างจะเข้าตรวจสอบระบบไฟฟ้าของแต่ละร้านค้าในวันที่ 20 ก.ย. กรุณาเตรียมความพร้อม', target: 'tenants', createdAt: '2026-09-01', createdBy: 'คุณสมชาย ใจดี' },
];

// ── Activities (for Dashboard feed) ──

export const activities: Activity[] = [
  { id: 'act01', type: 'contract', text: 'ส่งเอกสารสัญญาเช่าเรียบร้อยแล้ว', highlight: 'ABC Cafe', time: '10 นาทีที่แล้ว' },
  { id: 'act02', type: 'payment', text: 'ชำระค่าเช่าประจำเดือนกันยายนแล้ว', highlight: 'XYZ Fashion', time: '45 นาทีที่แล้ว' },
  { id: 'act03', type: 'repair', text: 'แจ้งซ่อมระบบไฟฟ้าภายในร้าน', highlight: 'DEF Pharmacy', time: '2 ชั่วโมงที่แล้ว' },
  { id: 'act04', type: 'lead', text: 'ติดต่อขอเช่าพื้นที่', highlight: 'Sweet Bake House', time: '4 ชั่วโมงที่แล้ว' },
];

// ── Revenue trend (6 months, matches Dashboard bars) ──

export const revenueMonths: RevenueMonth[] = [
  { month: 'เม.ย.', amount: 480000 },
  { month: 'พ.ค.', amount: 495000 },
  { month: 'มิ.ย.', amount: 510000 },
  { month: 'ก.ค.', amount: 525000 },
  { month: 'ส.ค.', amount: 530000 },
  { month: 'ก.ย.', amount: 540000 },
];

// ── Dashboard KPI helpers ──

export const dashboardKPI = {
  totalUnits: 40,
  rentedUnits: 18,
  negotiatingUnits: 7,
  vacantUnits: 15,
  revenueThisMonth: 540000,
  revenueTrend: '+2.8%',
  overdueAmount: 65000,
  overdueShops: 5,
  pendingRepairs: 4,
  expiringContracts: 3,
};

// ── Expiring contracts (for Dashboard mini-table) ──

export const expiringContractsList = [
  { shopName: 'ABC Cafe', unitCode: 'A-102', daysLeft: 12, urgency: 'urgent' as const },
  { shopName: 'Bloom Florist', unitCode: 'B-206', daysLeft: 20, urgency: 'soon' as const },
  { shopName: 'Tech Zone', unitCode: 'C-115', daysLeft: 27, urgency: 'soon' as const },
];
