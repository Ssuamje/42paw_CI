package proj.pet.board.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import proj.pet.board.domain.*;
import proj.pet.board.repository.BoardCategoryFilterRepository;
import proj.pet.board.repository.BoardMediaRepository;
import proj.pet.board.repository.BoardRepository;
import proj.pet.category.domain.AnimalCategory;
import proj.pet.category.domain.BoardCategoryFilter;
import proj.pet.category.domain.Species;
import proj.pet.category.repository.AnimalCategoryRepository;
import proj.pet.comment.repository.CommentRepository;
import proj.pet.exception.ExceptionStatus;
import proj.pet.exception.ServiceException;
import proj.pet.member.domain.Member;
import proj.pet.member.repository.MemberRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import static proj.pet.exception.ExceptionStatus.NOT_FOUND_BOARD;
import static proj.pet.exception.ExceptionStatus.NOT_FOUND_MEMBER;

/**
 * Board의 CUD 비즈니스 로직을 담당하는 서비스 구현체
 */
@Service
@Transactional
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

	private final BoardRepository boardRepository;
	private final MemberRepository memberRepository;
	private final BoardCategoryFilterRepository boardCategoryFilterRepository;
	private final BoardMediaManager boardMediaManager;
	private final BoardMediaRepository boardMediaRepository;
	private final AnimalCategoryRepository animalCategoryRepository;
	private final CommentRepository commentRepository;

	// TODO: 책임 분산이 필요할지도? + mediaData의 ContentType이 not null임을 검증해야 함.
	// v1.5 이벤트로 미디어 업로드 책임 분리

	/**
	 * {@inheritDoc}
	 *
	 * @throws ServiceException {@link ExceptionStatus#NOT_FOUND_MEMBER} 해당하는 멤버가 없을 경우
	 */
	@Override
	public Board createBoard(
			Long memberId,
			List<Species> speciesList,
			List<MultipartFile> mediaDtoList,
			String content,
			LocalDateTime now
	) {
		Member member = memberRepository.findById(memberId)
				.orElseThrow(NOT_FOUND_MEMBER::asServiceException);
		Board board = boardRepository.save(Board.of(member, VisibleScope.PUBLIC, content, now));

		List<AnimalCategory> animalCategories = animalCategoryRepository.findBySpeciesIn(
				speciesList);
		List<BoardCategoryFilter> categoryFilters = animalCategories.stream()
				.map(category -> BoardCategoryFilter.of(board, category))
				.toList();
		categoryFilters = boardCategoryFilterRepository.saveAll(categoryFilters);
		board.addCategoryFilters(categoryFilters);

		AtomicInteger index = new AtomicInteger(0);
		List<BoardMedia> mediaList = mediaDtoList.stream()
				.map(data -> {
					String mediaUrl = boardMediaManager.uploadMedia(data, UUID.randomUUID().toString());
					return BoardMedia.of(board, mediaUrl, index.getAndIncrement(),
							MediaType.from(data));
				}).collect(Collectors.toList());
		mediaList = boardMediaRepository.saveAll(mediaList);
		board.addMediaList(mediaList);

		return boardRepository.save(board);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @throws ServiceException {@link ExceptionStatus#NOT_FOUND_BOARD} 해당하는 게시글이 없을 경우
	 * @throws ServiceException {@link ExceptionStatus#UNAUTHENTICATED} 해당 게시글을 삭제할 권한이 없을 경우 - 본인의
	 *                          게시글이 아닐 때
	 */
	@Override
	public void deleteBoard(Long memberId, Long boardId) {
		Board board = boardRepository.findById(boardId)
				.orElseThrow(() -> new ServiceException(NOT_FOUND_BOARD));
		if (board.getDeletedAt() != null) {
			throw new ServiceException(NOT_FOUND_BOARD);
		}
		//TODO: 찾아온 board에서 boradId != memberId이면 ServiceException ?? -> 로직 확인 필요
//		if (!board.isId(memberId)) {
//			throw new ServiceException(UNAUTHENTICATED);
//		}
		if (!board.getComments().isEmpty()) {
			commentRepository.deleteAll(board.getComments());
		}
		boardCategoryFilterRepository.deleteAll(board.getCategoryFilters());
		boardMediaManager.deleteMediaByList(board.getMediaList());
		boardMediaRepository.deleteAll(board.getMediaList());
		board.delete();
	}
}
