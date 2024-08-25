import RumahTangga from "../models/rumahTanggaModel";
import { IRumahTangga } from "../models/rumahTanggaModel";
import Rt from "../models/rtModel";
import updateAllRtAggregates from "./rtAndRutaService";
import mongoose from "mongoose";

const VALID_KATEGORI_USAHA = [
  "kbli_a",
  "kbli_b",
  "kbli_c",
  "kbli_d",
  "kbli_e",
  "kbli_f",
  "kbli_g",
  "kbli_h",
  "kbli_i",
  "kbli_j",
  "kbli_k",
  "kbli_l",
  "kbli_m",
  "kbli_n",
  "kbli_o",
  "kbli_p",
  "kbli_q",
  "kbli_r",
  "kbli_s",
  "kbli_t",
  "kbli_u",
];

const VALID_LOKASI_TEMPAT_USAHA = [
  "bangunan-khusus-usaha",
  "bangunan-campuran",
  "kaki-lima",
  "keliling",
  "didalam-bangunan-tempat-tinggal/online",
];

const VALID_JENIS_KELAMIN = ["laki-laki", "perempuan"];

const VALID_PENDIDIKAN_TERAKHIR = [
  "sd/sederajat-kebawah",
  "smp/sederajat",
  "sma/sederajat",
  "diploma/s1-keatas",
];

const VALID_BENTUK_BADAN_USAHA = [
  "pt/persero/sejenisnya",
  "ijin-desa/ijin-lainnya",
  "tidak-berbadan-hukum",
];

const VALID_SKALA_USAHA = ["usaha-mikro", "usaha-kecil", "usaha-menengah"];

const validateRumahTanggaData = (data: IRumahTangga) => {
  if (!VALID_JENIS_KELAMIN.includes(data.jenis_kelamin)) {
    throw new Error(
      `Jenis kelamin tidak valid. Nilai valid: 'laki-laki' atau 'perempuan'.`
    );
  }

  if (!VALID_PENDIDIKAN_TERAKHIR.includes(data.pendidikan_terakhir)) {
    throw new Error(
      `Pendidikan terakhir tidak valid. Nilai valid: 'sd/sederajat-kebawah', 'smp/sederajat', 'sma/sederajat', atau 'diploma/s1-keatas'.`
    );
  }

  if (!VALID_KATEGORI_USAHA.includes(data.kategori_usaha)) {
    throw new Error(
      `Klasifikasi KBLI tidak valid. Nilai valid: 'kbli_a' - 'kbli_u'.`
    );
  }

  if (!VALID_BENTUK_BADAN_USAHA.includes(data.bentuk_badan_usaha)) {
    throw new Error(
      `Bentuk badan usaha tidak valid. Nilai valid: 'pt/persero/sejenisnya', 'ijin-desa/ijin-lainnya', atau 'tidak-berbadan-hukum'.`
    );
  }

  if (!VALID_LOKASI_TEMPAT_USAHA.includes(data.lokasi_tempat_usaha)) {
    throw new Error(
      `Jenis lokasi tempat usaha tidak valid. Nilai valid: 'bangunan-khusus-usaha', 'bangunan-campuran', 'kaki-lima', 'keliling', atau 'didalam-bangunan-tempat-tinggal/online'.`
    );
  }

  if (!VALID_SKALA_USAHA.includes(data.skala_usaha)) {
    throw new Error(
      `Skala usaha tidak valid. Nilai valid: 'usaha-mikro', 'usaha-kecil', atau 'usaha-menengah'.`
    );
  }
};

const generateNewKode = async (kodeRt: string) => {
  // Temukan nilai kode terbesar untuk kodeRt yang sama
  const latestRumahTangga = await RumahTangga.findOne({
    kode: new RegExp(`^${kodeRt}`),
  })
    .sort({ kode: -1 })  // Urutkan dari yang terbesar
    .limit(1); // Ambil hanya satu

  if (!latestRumahTangga) {
    // Jika tidak ada data sebelumnya, mulai dari kodeRt + '001'
    return `${kodeRt}001`;
  }

  const latestKode = latestRumahTangga.kode;
  const kodeWithoutRt = latestKode.substring(kodeRt.length);
  const incrementedKode = (parseInt(kodeWithoutRt, 10) + 1).toString().padStart(3, '0');

  return `${kodeRt}${incrementedKode}`;
};

const addRumahTangga = async (data: IRumahTangga | IRumahTangga[]) => {
  const dataArray = Array.isArray(data) ? data : [data];
  const session = await mongoose.startSession();
  let newRumahTangga: IRumahTangga[] = [];
  let allUpdatedRumahTangga: IRumahTangga[] = [];

  try {
    session.startTransaction();

    console.log("Validasi dan pencarian RT dimulai...");

    // Validasi data sebelum melakukan operasi database
    for (const item of dataArray) {
      validateRumahTanggaData(item);

      const rt = await Rt.findOne({ kode: item.kodeRt }).session(session);
      if (!rt) {
        throw new Error(`RT dengan kode ${item.kodeRt} tidak ditemukan. Pastikan kode RT yang dimasukkan benar.`);
      }

      // Generate kode baru dengan pengecekan duplikasi
      let newKode;
      do {
        newKode = await generateNewKode(item.kodeRt);
      } while (await RumahTangga.exists({ kode: newKode }));

      item.kode = newKode;

      // Simpan data sementara
      newRumahTangga.push(item);
    }

    console.log("Semua data valid, menyimpan data rumah tangga...");

    // Menyimpan data ke database
    await RumahTangga.insertMany(newRumahTangga, { session });

    console.log("Data rumah tangga berhasil disimpan. Memperbarui agregat RT...");

    // Mendapatkan semua kode RT yang ada dalam newRumahTangga
    const kodeRtList = [...new Set(newRumahTangga.map(item => item.kodeRt))];

    for (const kodeRt of kodeRtList) {
      // Ambil semua rumah tangga dengan kode RT yang sama
      const rumahTanggaList = await RumahTangga.find({ kodeRt }).sort({ kode: 1 }).session(session);
      
      let nextKodeNumber = 1;
      for (const rumahTangga of rumahTanggaList) {
        const newKode = `${kodeRt}${nextKodeNumber.toString().padStart(3, '0')}`;
        rumahTangga.kode = newKode;
        nextKodeNumber++;
      }

      // Update kode rumah tangga di database
      await Promise.all(rumahTanggaList.map(rumahTangga => rumahTangga.save({ session })));
      allUpdatedRumahTangga = allUpdatedRumahTangga.concat(rumahTanggaList);
    }

    await session.commitTransaction();
    session.endSession();

    // Perbarui agregat RT setelah menyimpan data
    await updateAllRtAggregates();

    console.log("Agregat RT berhasil diperbarui.");

    return allUpdatedRumahTangga;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Logging kesalahan
    if (error instanceof Error) {
      console.error(`Gagal menyimpan data keluarga UMKM: ${error.message}`);
      throw new Error(`Gagal menyimpan data keluarga UMKM: ${error.message}`);
    } else {
      console.error("Gagal menyimpan data keluarga UMKM: Unknown error");
      throw new Error("Gagal menyimpan data keluarga UMKM: Unknown error");
    }
  }
};


const updateRumahTangga = async (id: mongoose.Types.ObjectId, data: IRumahTangga) => {
  validateRumahTanggaData(data);

  const updatedRumahTangga = await RumahTangga.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
  if (updatedRumahTangga) {
    await updateAllRtAggregates();
  } else {
    throw new Error(
      "Keluarga UMKM dengan ID tersebut tidak ditemukan. Pastikan ID yang dimasukkan benar."
    );
  }

  return updatedRumahTangga;
};

const deleteRumahTangga = async (id: mongoose.Types.ObjectId) => {
  const rumahTangga = await RumahTangga.findByIdAndDelete(id);
  if (rumahTangga) {
    await updateAllRtAggregates();
  } else {
    throw new Error(
      "Keluarga UMKM dengan ID tersebut tidak ditemukan. Pastikan ID yang dimasukkan benar."
    );
  }

  return rumahTangga;
};

const getRumahTanggaByKode = async (kode: string) => {
  const rumahTangga = await RumahTangga.findOne({ kode });
  if (!rumahTangga) {
    throw new Error("Keluarga UMKM dengan kode tersebut tidak ditemukan.");
  }
  return rumahTangga;
};

const getAllRumahTangga = async () => {
  return await RumahTangga.find().sort({ kode: 1 });
};

export default {
  addRumahTangga,
  updateRumahTangga,
  deleteRumahTangga,
  getRumahTanggaByKode,
  getAllRumahTangga,
};
