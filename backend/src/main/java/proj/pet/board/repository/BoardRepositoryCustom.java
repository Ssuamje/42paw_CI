package proj.pet.board.repository;

import org.springframework.data.domain.PageRequest;
import proj.pet.board.domain.Board;

import java.util.List;

public interface BoardRepositoryCustom {

	List<Board> getMainViewBoards(PageRequest pageRequest);

	List<Board> getHotBoards(PageRequest pageRequest);

	List<Board> getMemberBoards(Long memberId, PageRequest pageRequest);

	List<Board> getScrapBoards(Long loginUserId, PageRequest pageRequest);

	List<Board> getFollowingsBoards(Long memberId, PageRequest pageRequest);

	long countByMemberId(Long memberId);

}
