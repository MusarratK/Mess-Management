package com.mess.management.repository;

import com.mess.management.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findFirstByMobileAndVerifiedFalseOrderByCreatedAtDesc(String mobile);

    Optional<OtpToken> findFirstByMobileAndOtpCodeAndVerifiedFalseOrderByCreatedAtDesc(String mobile, String otpCode);
}
