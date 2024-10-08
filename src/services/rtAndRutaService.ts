import mongoose from 'mongoose';
import rumahTanggaModel from '../models/rumahTanggaModel';
import rtModel from '../models/rtModel';

async function updateAllRtAggregates(): Promise<void> {
  try {
    // Ambil seluruh kode RT yang ada dari koleksi Rt
    const rtList = await rtModel.find({}, { "geojson.features.properties.kode": 1 });

    // Loop melalui setiap kode RT dan lakukan agregasi
    for (const rt of rtList) {
      const rtKode = rt.geojson.features[0].properties.kode;

      // Agregasi data dari koleksi RumahTangga untuk kode RT saat ini
      const aggregationResult = await rumahTanggaModel.aggregate([
        {
          $match: { kodeRt: rtKode } // Cocokkan kodeRt
        },
        {
          $group: {
            _id: "$kodeRt",
            totalUsaha: { $sum: 1 },
            kategoriUsahaCounts: {
              $push: {
                kategori_usaha: "$kategori_usaha",
                bentuk_badan_usaha: "$bentuk_badan_usaha",
                lokasi_tempat_usaha: "$lokasi_tempat_usaha",
                skala_usaha: "$skala_usaha"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalUsaha: 1,
            kategoriUsahaCounts: {
              $arrayToObject: {
                $map: {
                  input: [
                    "kbli_a", "kbli_b", "kbli_c", "kbli_d", "kbli_e", "kbli_f", "kbli_g", "kbli_h", "kbli_i", "kbli_j", "kbli_k", "kbli_l", "kbli_m", "kbli_n", "kbli_o", "kbli_p", "kbli_q", "kbli_r", "kbli_s", "kbli_t", "kbli_u"
                  ],
                  as: "kategori",
                  in: {
                    k: "$$kategori",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.kategori_usaha", "$$kategori"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            bentukBadanUsahaCounts: {
              $arrayToObject: {
                $map: {
                  input: ["pt/persero/sejenisnya", "ijin-desa/ijin-lainnya", "tidak-berbadan-hukum"],
                  as: "bentuk",
                  in: {
                    k: "$$bentuk",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.bentuk_badan_usaha", "$$bentuk"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            lokasiTempatUsahaCounts: {
              $arrayToObject: {
                $map: {
                  input: ["bangunan-khusus-usaha", "bangunan-campuran", "kaki-lima", "keliling", "didalam-bangunan-tempat-tinggal/online"],
                  as: "lokasi",
                  in: {
                    k: "$$lokasi",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.lokasi_tempat_usaha", "$$lokasi"] }
                        }
                      }
                    }
                  }
                }
              }
            },
            skalaUsahaCounts: {
              $arrayToObject: {
                $map: {
                  input: ["usaha-mikro", "usaha-kecil", "usaha-menengah"],
                  as: "skala",
                  in: {
                    k: "$$skala",
                    v: {
                      $size: {
                        $filter: {
                          input: "$kategoriUsahaCounts",
                          as: "item",
                          cond: { $eq: ["$$item.skala_usaha", "$$skala"] }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      // Jika tidak ada data agregat ditemukan, set semua nilai menjadi 0
      const aggregatedData = aggregationResult.length > 0 ? aggregationResult[0] : {
        totalUsaha: 0,
        kategoriUsahaCounts: {
          kbli_a: 0, kbli_b: 0, kbli_c: 0, kbli_d: 0, kbli_e: 0, kbli_f: 0,
          kbli_g: 0, kbli_h: 0, kbli_i: 0, kbli_j: 0, kbli_k: 0, kbli_l: 0,
          kbli_m: 0, kbli_n: 0, kbli_o: 0, kbli_p: 0, kbli_q: 0, kbli_r: 0,
          kbli_s: 0, kbli_t: 0, kbli_u: 0
        },
        bentukBadanUsahaCounts: {
          "pt/persero/sejenisnya": 0,
          "ijin-desa/ijin-lainnya": 0,
          "tidak-berbadan-hukum": 0
        },
        lokasiTempatUsahaCounts: {
          "bangunan-khusus-usaha": 0,
          "bangunan-campuran": 0,
          "kaki-lima": 0,
          "keliling": 0,
          "didalam-bangunan-tempat-tinggal/online": 0
        },
        skalaUsahaCounts: {
          "usaha-mikro": 0,
          "usaha-kecil": 0,
          "usaha-menengah": 0
        }
      };

      // Update data agregat di koleksi Rt
      await rtModel.updateOne(
        { "geojson.features.properties.kode": rtKode },
        {
          $set: {
            "geojson.features.$.properties.jml_umkm": aggregatedData.totalUsaha,
            "geojson.features.$.properties.jml_umkm_kbli_a": aggregatedData.kategoriUsahaCounts.kbli_a,
            "geojson.features.$.properties.jml_umkm_kbli_b": aggregatedData.kategoriUsahaCounts.kbli_b,
            "geojson.features.$.properties.jml_umkm_kbli_c": aggregatedData.kategoriUsahaCounts.kbli_c,
            "geojson.features.$.properties.jml_umkm_kbli_d": aggregatedData.kategoriUsahaCounts.kbli_d,
            "geojson.features.$.properties.jml_umkm_kbli_e": aggregatedData.kategoriUsahaCounts.kbli_e,
            "geojson.features.$.properties.jml_umkm_kbli_f": aggregatedData.kategoriUsahaCounts.kbli_f,
            "geojson.features.$.properties.jml_umkm_kbli_g": aggregatedData.kategoriUsahaCounts.kbli_g,
            "geojson.features.$.properties.jml_umkm_kbli_h": aggregatedData.kategoriUsahaCounts.kbli_h,
            "geojson.features.$.properties.jml_umkm_kbli_i": aggregatedData.kategoriUsahaCounts.kbli_i,
            "geojson.features.$.properties.jml_umkm_kbli_j": aggregatedData.kategoriUsahaCounts.kbli_j,
            "geojson.features.$.properties.jml_umkm_kbli_k": aggregatedData.kategoriUsahaCounts.kbli_k,
            "geojson.features.$.properties.jml_umkm_kbli_l": aggregatedData.kategoriUsahaCounts.kbli_l,
            "geojson.features.$.properties.jml_umkm_kbli_m": aggregatedData.kategoriUsahaCounts.kbli_m,
            "geojson.features.$.properties.jml_umkm_kbli_n": aggregatedData.kategoriUsahaCounts.kbli_n,
            "geojson.features.$.properties.jml_umkm_kbli_o": aggregatedData.kategoriUsahaCounts.kbli_o,
            "geojson.features.$.properties.jml_umkm_kbli_p": aggregatedData.kategoriUsahaCounts.kbli_p,
            "geojson.features.$.properties.jml_umkm_kbli_q": aggregatedData.kategoriUsahaCounts.kbli_q,
            "geojson.features.$.properties.jml_umkm_kbli_r": aggregatedData.kategoriUsahaCounts.kbli_r,
            "geojson.features.$.properties.jml_umkm_kbli_s": aggregatedData.kategoriUsahaCounts.kbli_s,
            "geojson.features.$.properties.jml_umkm_kbli_t": aggregatedData.kategoriUsahaCounts.kbli_t,
            "geojson.features.$.properties.jml_umkm_kbli_u": aggregatedData.kategoriUsahaCounts.kbli_u,
            "geojson.features.$.properties.jml_umkm_bentuk_pt_persero_sejenisnya": aggregatedData.bentukBadanUsahaCounts["pt/persero/sejenisnya"],
            "geojson.features.$.properties.jml_umkm_bentuk_ijin_desa_ijin_lainnya": aggregatedData.bentukBadanUsahaCounts["ijin-desa/ijin-lainnya"],
            "geojson.features.$.properties.jml_umkm_bentuk_tidak_berbadan_hukum": aggregatedData.bentukBadanUsahaCounts["tidak-berbadan-hukum"],
            "geojson.features.$.properties.jml_umkm_lokasi_bangunan_khusus_usaha": aggregatedData.lokasiTempatUsahaCounts["bangunan-khusus-usaha"],
            "geojson.features.$.properties.jml_umkm_lokasi_bangunan_campuran": aggregatedData.lokasiTempatUsahaCounts["bangunan-campuran"],
            "geojson.features.$.properties.jml_umkm_lokasi_kaki_lima": aggregatedData.lokasiTempatUsahaCounts["kaki-lima"],
            "geojson.features.$.properties.jml_umkm_lokasi_keliling": aggregatedData.lokasiTempatUsahaCounts["keliling"],
            "geojson.features.$.properties.jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online": aggregatedData.lokasiTempatUsahaCounts["didalam-bangunan-tempat-tinggal/online"],
            "geojson.features.$.properties.jml_umkm_skala_usaha_mikro": aggregatedData.skalaUsahaCounts["usaha-mikro"],
            "geojson.features.$.properties.jml_umkm_skala_usaha_kecil": aggregatedData.skalaUsahaCounts["usaha-kecil"],
            "geojson.features.$.properties.jml_umkm_skala_usaha_menengah": aggregatedData.skalaUsahaCounts["usaha-menengah"]
          },
        },
        { arrayFilters: [{ "elem.properties.kode": rtKode }] }
      );
    }
  } catch (error) {
    console.error("Error updating RT aggregate data:", error);
  }
}

export default updateAllRtAggregates;
