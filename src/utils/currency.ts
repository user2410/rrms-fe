export function ToMillion(number: number, toFixed: number = 0) : string {
  return `${(number / 1000000).toFixed(toFixed)} triệu`;
}

const ChuSo = new Array(" không ", " một ", " hai ", " ba ", " bốn ", " năm ", " sáu ", " bảy ", " tám ", " chín ");
const Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

function docSo3ChuSo(baso: number): string {
  let tram: number;
  let chuc: number;
  let donvi: number;
  let KetQua = "";
  tram = Math.floor(baso / 100);
  chuc = Math.floor((baso % 100) / 10);
  donvi = baso % 10;
  if (tram === 0 && chuc === 0 && donvi === 0) return "";
  if (tram !== 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if ((chuc === 0) && (donvi !== 0)) KetQua += " linh ";
  }
  if ((chuc !== 0) && (chuc !== 1)) {
    KetQua += ChuSo[chuc] + " mươi";
    if ((chuc === 0) && (donvi !== 0)) KetQua = KetQua + " linh ";
  }
  if (chuc === 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if ((chuc !== 0) && (chuc !== 1)) {
        KetQua += " mốt ";
      }
      else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc === 0) {
        KetQua += ChuSo[donvi];
      }
      else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi !== 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
}

export function readMoneyVi(SoTien: number): string {
  let lan = 0;
  let i = 0;
  let so = 0;
  let KetQua = "";
  let tmp = "";
  let soAm = false;
  let ViTri: number[] = new Array(6).fill(0);

  if (SoTien < 0) soAm = true;
  if (SoTien === 0) return "Không đồng";
  if (SoTien > 0) {
    so = SoTien;
  }
  else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    return "";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = Math.floor(so / 1000000);
  so = so - parseFloat(ViTri[2].toString()) * 1000000;
  ViTri[1] = Math.floor((so % 1000000) / 1000);
  so = so - parseFloat(ViTri[1].toString()) * 1000;
  ViTri[0] = so % 1000;
  if (ViTri[5] > 0) {
    lan = 5;
  }
  else if (ViTri[4] > 0) {
    lan = 4;
  }
  else if (ViTri[3] > 0) {
    lan = 3;
  }
  else if (ViTri[2] > 0) {
    lan = 2;
  }
  else if (ViTri[1] > 0) {
    lan = 1;
  }
  else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = docSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if ((i > 0) && (tmp.length > 0)) KetQua += '';
  }
  if (KetQua.substring(KetQua.length - 1) == ',') {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  if (soAm) {
    return "Âm " + KetQua + " đồng";
  }
  else {
    return KetQua + " đồng";
  }
}
