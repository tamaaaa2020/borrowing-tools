-- Trigger untuk mencatat log aktivitas otomatis saat barang dikembalikan
-- Jalankan script ini di tab SQL phpMyAdmin Anda

DELIMITER //

CREATE TRIGGER after_peminjaman_update
AFTER UPDATE ON Peminjaman
FOR EACH ROW
BEGIN
    -- Jika status berubah menjadi DIKEMBALIKAN
    IF OLD.status <> NEW.status AND NEW.status = 'DIKEMBALIKAN' THEN
        INSERT INTO LogAktivitas (id_user, aktivitas, timestamp)
        VALUES (NEW.id_user, CONCAT('Mengembalikan alat ID: ', NEW.id_alat, ' pada ', NOW()), NOW());
    END IF;
    
    -- Jika status berubah menjadi DIPINJAM (Disetujui Admin)
    IF OLD.status <> NEW.status AND NEW.status = 'DIPINJAM' THEN
        INSERT INTO LogAktivitas (id_user, aktivitas, timestamp)
        VALUES (NEW.id_user, CONCAT('Peminjaman alat ID: ', NEW.id_alat, ' telah disetujui'), NOW());
    END IF;
END //

DELIMITER ;
