package proj.pet.member.service;

import org.springframework.web.multipart.MultipartFile;
import proj.pet.member.domain.Member;
import proj.pet.member.dto.MemberCreateRequestDto;

public interface MemberService {
	void uploadMemberProfileImage(Long memberId, MultipartFile profileImageData);

	void changeMemberProfileImage(Long memberId, MultipartFile profileImageData);

	Member createMember(MemberCreateRequestDto memberCreateRequestDto);
}
