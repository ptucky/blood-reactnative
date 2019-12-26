import AccidentType from '../models/accident-type';

export const ACCIDENTTYPE = [
  new AccidentType('1', 'เข็มทิ่มตำ'),
  new AccidentType('2', 'เครื่องมือมีคมบาด'),
  new AccidentType('3', 'อุปกรณ์ที่ทำจากแก้วแตกบาด'),
  new AccidentType('4', 'เลือดหรือสารคัดหลั่งกระเด็นเข้าตา'),
  new AccidentType('5', 'เลือดหรือสารคัดหลั่งกระเด็นเข้าจมูก'),
  new AccidentType('6', 'เลือดหรือสารคัดหลั่งกระเด็นเข้าปาก'),
  new AccidentType('7', 'เลือดหรือสารคัดหลั่งสัมผัสผิวหนังที่ ไม่มีบาดแผล'),
  new AccidentType('8', 'เลือดหรือสารคัดหลั่งสัมผัสผิวหนังที่ มีบาดแผล'),
  new AccidentType('9', 'ผู้ป่วยกัด'),
  new AccidentType('10', 'อื่นๆโปรดระบุ')
];
