import ProfileTemplate from "@/pages/ProfilePage/Component/ProfileTemplate";
import { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import LoadingAnimation from "@/components/loading/LoadingAnimation";
import { Board } from "@/types/enum/board.category.enum";
import { useSetRecoilState, useRecoilState } from "recoil";
import { boardCategoryState } from "@/recoil/atom";
import { IBoardInfo } from "@/types/interface/board.interface";

const MyProfilePage = () => {
  const { fetchMyProfile } = useFetch();
  // const { data: profileData, isLoading: profileLoading } = useQuery({
  const profileQuery = useQuery({
    queryKey: ["myProfile"],
    queryFn: fetchMyProfile,
    refetchOnMount: "always",
  });
  const { fetchBoards } = useFetch();
  const [boardCategory] = useRecoilState<Board>(boardCategoryState);
  const setBoard = useSetRecoilState<Board>(boardCategoryState);

  useEffect(() => {
    setBoard(Board.MINE);
  }, []); // 빈 배열을 넣어 마운트 시 한 번만 실행되도록 함

  // const {
  //   isLoading: boardLoading,
  //   isError,
  //   data: boards,
  // } = useQuery({
  const boardsQuery = useQuery<IBoardInfo[]>({
    queryKey: ["boards", boardCategory], // 여기서 boardCategory를 그냥 Board.MINE하는게?
    queryFn: fetchBoards,
    keepPreviousData: true,
  });

  const isLoading = profileQuery.isLoading || boardsQuery.isLoading;

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <ProfileTemplate
      userInfo={profileQuery.data || null}
      boards={boardsQuery.data || null}
    />
  );
};

export default MyProfilePage;
