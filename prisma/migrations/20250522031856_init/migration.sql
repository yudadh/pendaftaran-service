-- CreateTable
CREATE TABLE `m_agama` (
    `agama_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_agama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`agama_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_banjars` (
    `banjar_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `desa_id` INTEGER UNSIGNED NOT NULL,
    `banjar_nama` VARCHAR(255) NOT NULL,
    `lintang` DECIMAL(12, 9) NULL,
    `bujur` DECIMAL(12, 9) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `m_banjars_desa_id_foreign`(`desa_id`),
    PRIMARY KEY (`banjar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_desas` (
    `desa_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kecamatan_id` INTEGER UNSIGNED NOT NULL,
    `desa_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `kecamatan_id`(`kecamatan_id`),
    INDEX `m_desas_kecamatan_id_foreign`(`kecamatan_id`),
    PRIMARY KEY (`desa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_jalurs` (
    `jalur_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jalur_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`jalur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_kabupatens` (
    `kabupaten_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `provinsi_id` INTEGER UNSIGNED NOT NULL,
    `kabupaten_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `provinsi_id`(`provinsi_id`),
    PRIMARY KEY (`kabupaten_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_kecamatans` (
    `kecamatan_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `kabupaten_id` INTEGER UNSIGNED NOT NULL,
    `kecamatan_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `kabupaten_id`(`kabupaten_id`),
    INDEX `m_kecamatans_kabupaten_id_foreign`(`kabupaten_id`),
    PRIMARY KEY (`kecamatan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_pekerjaan` (
    `pekerjaan_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama_pekerjaan` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`pekerjaan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_penghasilan` (
    `penghasilan_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `penghasilan` VARCHAR(255) NULL,

    PRIMARY KEY (`penghasilan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_provinsis` (
    `provinsi_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `provinsi_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`provinsi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_sekolahs` (
    `sekolah_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `sekolah_nama` VARCHAR(255) NOT NULL,
    `npsn` VARCHAR(255) NULL,
    `jenjang_sekolah_id` INTEGER UNSIGNED NOT NULL,
    `banjar_id` INTEGER UNSIGNED NULL,
    `desa_id` INTEGER UNSIGNED NOT NULL,
    `kecamatan_id` INTEGER UNSIGNED NOT NULL,
    `kabupaten_id` INTEGER UNSIGNED NOT NULL,
    `provinsi_id` INTEGER UNSIGNED NOT NULL,
    `jumlah_kelas` INTEGER UNSIGNED NOT NULL,
    `total_daya_tampung` INTEGER UNSIGNED NOT NULL,
    `isclosed` INTEGER NULL DEFAULT 0,
    `lintang` DECIMAL(12, 9) NOT NULL,
    `bujur` DECIMAL(12, 9) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `m_sekolahs_user_id_key`(`user_id`),
    INDEX `m_sekolahs_banjar_id_foreign`(`banjar_id`),
    INDEX `m_sekolahs_desa_id_foreign`(`desa_id`),
    INDEX `m_sekolahs_jenjang_sekolah_id_foreign`(`jenjang_sekolah_id`),
    INDEX `m_sekolahs_kabupaten_id_foreign`(`kabupaten_id`),
    INDEX `m_sekolahs_kecamatan_id_foreign`(`kecamatan_id`),
    INDEX `m_sekolahs_provinsi_id_foreign`(`provinsi_id`),
    PRIMARY KEY (`sekolah_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kuota_sekolah` (
    `kuota_sekolah_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `sekolah_id` INTEGER UNSIGNED NOT NULL,
    `kuota_id` TINYINT UNSIGNED NOT NULL,
    `periode_id` TINYINT UNSIGNED NOT NULL,
    `kuota` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `kuota_old` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `kuota_sekolah_kuota_id_fkey`(`kuota_id`),
    INDEX `kuota_sekolah_periode_id_fkey`(`periode_id`),
    UNIQUE INDEX `kuota_sekolah_sekolah_id_kuota_id_periode_id_key`(`sekolah_id`, `kuota_id`, `periode_id`),
    PRIMARY KEY (`kuota_sekolah_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_kuotas` (
    `kuota_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenis_kuota` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`kuota_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_siswas` (
    `siswa_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER UNSIGNED NULL,
    `banjar_id` INTEGER UNSIGNED NULL,
    `desa_id` INTEGER UNSIGNED NULL,
    `kecamatan_id` INTEGER UNSIGNED NULL,
    `kabupaten_id` INTEGER UNSIGNED NULL,
    `provinsi_id` INTEGER UNSIGNED NULL,
    `sekolah_asal_id` INTEGER UNSIGNED NULL,
    `nama` VARCHAR(255) NOT NULL,
    `tempat_lahir` VARCHAR(255) NOT NULL,
    `tanggal_lahir` DATE NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL,
    `nomor_telepon` VARCHAR(15) NULL,
    `agama_id` TINYINT UNSIGNED NULL,
    `nik` VARCHAR(16) NULL,
    `nisn` VARCHAR(10) NOT NULL,
    `alamat_tinggal` VARCHAR(255) NOT NULL,
    `alamat_kk` VARCHAR(255) NULL,
    `isluartabanan` INTEGER NULL DEFAULT 0,
    `nama_ibu` VARCHAR(255) NOT NULL,
    `pekerjaan_ibu_id` TINYINT UNSIGNED NOT NULL,
    `penghasilan_ibu_id` INTEGER UNSIGNED NULL,
    `nama_ayah` VARCHAR(255) NULL,
    `pekerjaan_ayah_id` TINYINT UNSIGNED NOT NULL,
    `penghasilan_ayah_id` INTEGER UNSIGNED NULL,
    `nama_wali` VARCHAR(255) NULL,
    `pekerjaan_wali_id` TINYINT UNSIGNED NULL,
    `penghasilan_wali_id` INTEGER UNSIGNED NULL,
    `kebutuhan_khusus` INTEGER NOT NULL,
    `lintang` DOUBLE NULL,
    `bujur` DOUBLE NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `m_siswas_user_id_key`(`user_id`),
    INDEX `m_siswas_banjar_id_foreign`(`banjar_id`),
    INDEX `m_siswas_desa_id_foreign`(`desa_id`),
    INDEX `m_siswas_kabupaten_id_foreign`(`kabupaten_id`),
    INDEX `m_siswas_kecamatan_id_foreign`(`kecamatan_id`),
    INDEX `m_siswas_m_agama_FK`(`agama_id`),
    INDEX `m_siswas_provinsi_id_foreign`(`provinsi_id`),
    INDEX `m_siswas_sekolah_asal_id_foreign`(`sekolah_asal_id`),
    PRIMARY KEY (`siswa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_tahapans` (
    `tahapan_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `tahapan_nama` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`tahapan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_zonasis` (
    `zonasi_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sekolah_id` INTEGER UNSIGNED NOT NULL,
    `banjar_id` INTEGER UNSIGNED NOT NULL,
    `jenjang_sekolah_id` TINYINT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `m_zonasis_banjar_id_foreign`(`banjar_id`),
    INDEX `m_zonasis_sekolah_id_foreign`(`sekolah_id`),
    PRIMARY KEY (`zonasi_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_jenjang_sekolahs` (
    `jenjang_sekolah_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jenjang_sekolah` VARCHAR(255) NOT NULL,
    `max_siswa_per_kelas` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`jenjang_sekolah_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_dokumen` (
    `dokumen_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `dokumen_jenis` VARCHAR(255) NOT NULL,
    `is_umum` BOOLEAN NOT NULL DEFAULT false,
    `keterangan` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`dokumen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumen_jalur` (
    `dokumen_jalur_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `jalur_id` TINYINT UNSIGNED NOT NULL,
    `dokumen_id` INTEGER UNSIGNED NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `dokumen_jalur_dokumen_id_fkey`(`dokumen_id`),
    INDEX `dokumen_jalur_jalur_id_fkey`(`jalur_id`),
    PRIMARY KEY (`dokumen_jalur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dokumen_siswa` (
    `dokumen_siswa_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` INTEGER UNSIGNED NOT NULL,
    `dokumen_id` INTEGER UNSIGNED NOT NULL,
    `dokumen_url` TEXT NOT NULL,
    `file_path` TEXT NOT NULL,
    `url_expires_at` TIMESTAMP(0) NOT NULL,
    `status` ENUM('BELUM_VALID', 'VALID_SD', 'VALID_SMP') NOT NULL DEFAULT 'BELUM_VALID',
    `keterangan` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `dokumen_siswa_dokumen_id_fkey`(`dokumen_id`),
    UNIQUE INDEX `dokumen_siswa_siswa_id_dokumen_id_key`(`siswa_id`, `dokumen_id`),
    PRIMARY KEY (`dokumen_siswa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_pendaftaran` (
    `pendaftaran_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `siswa_id` INTEGER UNSIGNED NOT NULL,
    `periode_jalur_id` SMALLINT UNSIGNED NOT NULL,
    `sekolah_id` INTEGER UNSIGNED NOT NULL,
    `umur_siswa` INTEGER UNSIGNED NOT NULL,
    `jarak_lurus` DOUBLE NOT NULL,
    `jarak_rute` DOUBLE NOT NULL,
    `status` ENUM('DIBATALKAN', 'BELUM_VERIF', 'VERIF_SD', 'VERIF_SMP') NOT NULL DEFAULT 'BELUM_VERIF',
    `status_kelulusan` ENUM('PENDAFTARAN', 'LULUS', 'TIDAK_LULUS') NOT NULL DEFAULT 'PENDAFTARAN',
    `keterangan` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `m_pendaftaran_siswa_id_key`(`siswa_id`),
    INDEX `m_pendaftaran_m_sekolahs_FK`(`sekolah_id`),
    INDEX `m_pendaftaran_periode_jalur_id_fkey`(`periode_jalur_id`),
    PRIMARY KEY (`pendaftaran_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_periode` (
    `periode_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `waktu_mulai` TIMESTAMP(0) NULL,
    `waktu_selesai` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`periode_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periode_jalur` (
    `periode_jalur_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `periode_id` TINYINT UNSIGNED NOT NULL,
    `jalur_id` TINYINT UNSIGNED NOT NULL,
    `waktu_mulai` TIMESTAMP(0) NULL,
    `waktu_selesai` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `periode_jalur_jalur_id_fkey`(`jalur_id`),
    UNIQUE INDEX `periode_jalur_periode_id_jalur_id_key`(`periode_id`, `jalur_id`),
    PRIMARY KEY (`periode_jalur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal` (
    `jadwal_id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `periode_jalur_id` SMALLINT UNSIGNED NOT NULL,
    `tahapan_id` TINYINT UNSIGNED NOT NULL,
    `waktu_mulai` TIMESTAMP(0) NULL,
    `waktu_selesai` TIMESTAMP(0) NULL,
    `is_closed` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `jadwal_tahapan_id_fkey`(`tahapan_id`),
    UNIQUE INDEX `jadwal_periode_jalur_id_tahapan_id_key`(`periode_jalur_id`, `tahapan_id`),
    PRIMARY KEY (`jadwal_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_user` (
    `user_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role_id` TINYINT UNSIGNED NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    INDEX `m_user_role_id_fkey`(`role_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `m_role` (
    `role_id` TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_nama` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `m_banjars` ADD CONSTRAINT `m_banjars_ibfk_1` FOREIGN KEY (`desa_id`) REFERENCES `m_desas`(`desa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_desas` ADD CONSTRAINT `m_desas_ibfk_1` FOREIGN KEY (`kecamatan_id`) REFERENCES `m_kecamatans`(`kecamatan_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_kabupatens` ADD CONSTRAINT `m_kabupatens_provinsi_id_foreign` FOREIGN KEY (`provinsi_id`) REFERENCES `m_provinsis`(`provinsi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_kecamatans` ADD CONSTRAINT `m_kecamatans_ibfk_1` FOREIGN KEY (`kabupaten_id`) REFERENCES `m_kabupatens`(`kabupaten_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_banjar_id_fkey` FOREIGN KEY (`banjar_id`) REFERENCES `m_banjars`(`banjar_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_desa_id_fkey` FOREIGN KEY (`desa_id`) REFERENCES `m_desas`(`desa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_kabupaten_id_fkey` FOREIGN KEY (`kabupaten_id`) REFERENCES `m_kabupatens`(`kabupaten_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_kecamatan_id_fkey` FOREIGN KEY (`kecamatan_id`) REFERENCES `m_kecamatans`(`kecamatan_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_provinsi_id_fkey` FOREIGN KEY (`provinsi_id`) REFERENCES `m_provinsis`(`provinsi_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_sekolahs` ADD CONSTRAINT `m_sekolahs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `m_user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kuota_sekolah` ADD CONSTRAINT `kuota_sekolah_kuota_id_fkey` FOREIGN KEY (`kuota_id`) REFERENCES `m_kuotas`(`kuota_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kuota_sekolah` ADD CONSTRAINT `kuota_sekolah_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `m_periode`(`periode_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kuota_sekolah` ADD CONSTRAINT `kuota_sekolah_sekolah_id_fkey` FOREIGN KEY (`sekolah_id`) REFERENCES `m_sekolahs`(`sekolah_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_agama_FK` FOREIGN KEY (`agama_id`) REFERENCES `m_agama`(`agama_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_banjars_FK` FOREIGN KEY (`banjar_id`) REFERENCES `m_banjars`(`banjar_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_desas_FK` FOREIGN KEY (`desa_id`) REFERENCES `m_desas`(`desa_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_kabupatens_FK` FOREIGN KEY (`kabupaten_id`) REFERENCES `m_kabupatens`(`kabupaten_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_kecamatans_FK` FOREIGN KEY (`kecamatan_id`) REFERENCES `m_kecamatans`(`kecamatan_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_provinsis_FK` FOREIGN KEY (`provinsi_id`) REFERENCES `m_provinsis`(`provinsi_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_m_sekolahs_FK` FOREIGN KEY (`sekolah_asal_id`) REFERENCES `m_sekolahs`(`sekolah_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_siswas` ADD CONSTRAINT `m_siswas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `m_user`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_zonasis` ADD CONSTRAINT `m_zonasis_banjar_id_foreign` FOREIGN KEY (`banjar_id`) REFERENCES `m_banjars`(`banjar_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_zonasis` ADD CONSTRAINT `m_zonasis_sekolah_id_foreign` FOREIGN KEY (`sekolah_id`) REFERENCES `m_sekolahs`(`sekolah_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_jalur` ADD CONSTRAINT `dokumen_jalur_dokumen_id_fkey` FOREIGN KEY (`dokumen_id`) REFERENCES `m_dokumen`(`dokumen_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_jalur` ADD CONSTRAINT `dokumen_jalur_jalur_id_fkey` FOREIGN KEY (`jalur_id`) REFERENCES `m_jalurs`(`jalur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_siswa` ADD CONSTRAINT `dokumen_siswa_dokumen_id_fkey` FOREIGN KEY (`dokumen_id`) REFERENCES `m_dokumen`(`dokumen_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dokumen_siswa` ADD CONSTRAINT `dokumen_siswa_m_siswas_FK` FOREIGN KEY (`siswa_id`) REFERENCES `m_siswas`(`siswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_pendaftaran` ADD CONSTRAINT `m_pendaftaran_m_sekolahs_FK` FOREIGN KEY (`sekolah_id`) REFERENCES `m_sekolahs`(`sekolah_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_pendaftaran` ADD CONSTRAINT `m_pendaftaran_m_siswas_FK` FOREIGN KEY (`siswa_id`) REFERENCES `m_siswas`(`siswa_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_pendaftaran` ADD CONSTRAINT `m_pendaftaran_periode_jalur_id_fkey` FOREIGN KEY (`periode_jalur_id`) REFERENCES `periode_jalur`(`periode_jalur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periode_jalur` ADD CONSTRAINT `periode_jalur_jalur_id_fkey` FOREIGN KEY (`jalur_id`) REFERENCES `m_jalurs`(`jalur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periode_jalur` ADD CONSTRAINT `periode_jalur_periode_id_fkey` FOREIGN KEY (`periode_id`) REFERENCES `m_periode`(`periode_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_periode_jalur_id_fkey` FOREIGN KEY (`periode_jalur_id`) REFERENCES `periode_jalur`(`periode_jalur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_tahapan_id_fkey` FOREIGN KEY (`tahapan_id`) REFERENCES `m_tahapans`(`tahapan_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_user` ADD CONSTRAINT `m_user_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `m_role`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
