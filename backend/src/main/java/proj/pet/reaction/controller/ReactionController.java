package proj.pet.reaction.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import proj.pet.auth.domain.AuthGuard;
import proj.pet.auth.domain.AuthLevel;
import proj.pet.member.domain.UserSession;
import proj.pet.member.dto.UserSessionDto;
import proj.pet.reaction.dto.ReactionRequestDto;
import proj.pet.reaction.service.ReactionFacadeService;

@RestController
@RequestMapping("/v1/reactions")
@RequiredArgsConstructor
public class ReactionController {

	private final ReactionFacadeService reactionFacadeService;

	@PostMapping
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void createReaction(
			@UserSession UserSessionDto userSessionDto,
			@RequestBody ReactionRequestDto reactionRequestDto) {
		reactionFacadeService.createReaction(userSessionDto, reactionRequestDto);
	}

	@DeleteMapping("/boards/{boardId}")
	@AuthGuard(level = AuthLevel.USER_OR_ADMIN)
	public void deleteReaction(
			@UserSession UserSessionDto userSessionDto,
			@PathVariable("boardId") Long boardId) {
		reactionFacadeService.deleteReaction(userSessionDto, boardId);
	}
}
