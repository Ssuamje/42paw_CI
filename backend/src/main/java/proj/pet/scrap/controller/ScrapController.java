package proj.pet.scrap.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import proj.pet.auth.domain.AuthGuard;
import proj.pet.auth.domain.AuthLevel;
import proj.pet.board.dto.BoardsPaginationDto;
import proj.pet.member.domain.UserSession;
import proj.pet.member.dto.UserSessionDto;
import proj.pet.scrap.dto.ScrapCreateRequestDto;
import proj.pet.scrap.service.ScrapFacadeService;

@RestController
@RequestMapping("/v1/scraps")
@RequiredArgsConstructor
public class ScrapController {

	private final ScrapFacadeService scrapFacadeService;

	@GetMapping("/members/me")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public BoardsPaginationDto getMyScraps(
			@UserSession UserSessionDto userSessionDto,
			@RequestParam("page") int page,
			@RequestParam("size") int size
	) {
		PageRequest pageRequest = PageRequest.of(page, size);
		return scrapFacadeService.getMyScraps(userSessionDto, pageRequest);
	}

	@PostMapping
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void createScrap(
			@UserSession UserSessionDto userSessionDto,
			@RequestBody ScrapCreateRequestDto scrapCreateRequestDto
	) {
		scrapFacadeService.createScrap(userSessionDto, scrapCreateRequestDto);
	}

	@DeleteMapping("/boards/{boardId}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void deleteScrap(
			@UserSession UserSessionDto userSessionDto,
			@PathVariable Long boardId
	) {
		scrapFacadeService.deleteScrap(userSessionDto, boardId);
	}
}
