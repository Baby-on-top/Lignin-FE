/** @jsxImportSource @emotion/react */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import muji from "../../assets/muji.jpg";
import { kakaoUnlink, kakaoInfo } from "../../utils/apis";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import WorkSpaceModal from "./WorkSpaceModal";
import {
  SelectedWsIdx,
  SelectedWsName,
  showUserInfo,
  recoilWsList,
} from "../../utils/atoms";
import { useRecoilState } from "recoil";
import { motion, useAnimate, stagger } from "framer-motion";
import InviteModal from "./InviteModal";
import UnlinkCheckModal from "./UnlinkCheckModal";
import useModal from "../modal/useModal";
import {
  ArrowRightOnRectangleIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { Urls } from "../../utils/urls";
import { awareness } from "../tldraw/store";

export default function SideNav() {
  const { modalOpen, close, open } = useModal();
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_LOGOUT_URI = process.env.REACT_APP_LOGOUT_REDIRECT_URI;
  const logoutLink = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${REDIRECT_LOGOUT_URI}`;
  const [cookies] = useCookies(["cookies"]);
  const [profile, setProfile] = useState();
  const [name, setName] = useState();
  const [workspaceList, setWorkspaceList] = useRecoilState(recoilWsList);
  // const [workspaceList, setWorkspaceList] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUnlink, setIsUnlink] = useState(false);
  const [, setUserInfo] = useRecoilState(showUserInfo);

  const navigate = useNavigate();

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };

  async function getUserInfo() {
    const token = cookies.accessToken;
    if (!token) {
      // 토큰이 없다면 로그인 화면으로 라우팅
      navigate("/login");
      return;
    }

    const response = await kakaoInfo(cookies);
    const data = {
      id: response.data.data.memberId,
      name: response.data.data.name,
      profile: response.data.data.profile,
    };
    setName(response.data.data.name);
    setProfile(response.data.data.profile);
    setUserInfo(data);
  }

  const fetchData = async () => {
    const token = cookies.accessToken;
    if (!token) {
      navigate("/login");
      return;
    }

    const response = await axios.get(Urls.WORKSPACE, {
      headers: { Token: cookies.accessToken },
    });
    setWorkspaceList(response.data.data);
    if (wsIdx == 0 && response.data.data.length > 0) {
      setWsIdx(response.data.data[0].workspaceId);
      setWsName(response.data.data[0].workspaceName);
    }
  };

  // hover 시작
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  // hover 끝

  // ref
  const refs = useRef([]);

  const [wsIdx, setWsIdx] = useRecoilState(SelectedWsIdx);
  const [wsName, setWsName] = useRecoilState(SelectedWsName);
  const [isMenu, setIsMenu] = useState(false);
  const selIdx = (name, idx) => {
    setWsName(name);
    setWsIdx(idx);
  };

  const unlink = async () => {
    const response = await kakaoUnlink(cookies);
    if (response.status === 200) {
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserInfo();
    fetchData();
  }, [cookies]);

  useEffect(() => {
    fetchData();
  }, [isUpdate]);

  useEffect(() => {
    fetchData();
  }, [wsName]);

  return (
    <div
      className="side-nav"
      css={{
        width: "300px",
        height: "100%",
        background: "white",
        position: "fixed",
        float: "left",
        borderRight: "1px solid black",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 프로필 컨테이너 */}
      <div
        css={{
          display: "flex",
          height: "150px",
          borderBottom: "3px solid #cacaca",
        }}
      >
        {/* 사진 */}
        <div
          css={{
            display: "flex",
            flex: "3",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            className="muji"
            src={profile ?? muji}
            alt="얼굴"
            css={{
              width: "80px",
              height: "80px",
              float: "left",
              borderRadius: "50px",
            }}
          />
        </div>

        {/* 정보 */}
        <div
          css={{
            display: "flex",
            flex: "4",
          }}
        >
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              marginTop: "30px",
            }}
          >
            <div
              className="name"
              css={{
                fontSize: "30px",
                display: "flex",
                flex: "1",
                paddingLeft: "25px",
              }}
            >
              {name}
            </div>
            <div
              css={{
                flex: "1",
                display: "flex",
                padding: "0px 10px",
                marginRight: "40px",
                justifyContent: "space-around",
              }}
            >
              <ArrowRightOnRectangleIcon
                onClick={() => {
                  window.location.href = logoutLink;
                }}
                width={40}
                height={40}
                css={{
                  backgroundColor: "#cbcbcb",
                  borderRadius: "10px",
                  padding: "5px 5px",
                }}
              ></ArrowRightOnRectangleIcon>
              <PowerIcon
                onClick={() => {
                  setIsUnlink(true);
                }}
                width={40}
                height={40}
                css={{
                  backgroundColor: "#efa8a8",
                  borderRadius: "10px",
                  padding: "5px 5px",
                }}
              ></PowerIcon>
            </div>
          </div>
        </div>
      </div>

      <div className="side-nav-mid">
        <p
          css={{
            marginLeft: "15px",
            fontSize: "25px",
            fontWeight: "bold",
          }}
        >
          workspace
        </p>
      </div>

      <motion.div
        className="side-nav-end"
        css={{
          fontSize: "20px",
          display: "flex",
          flexDirection: "column",
          flex: 8,
          overflow: "scroll",
          overflowX: "hidden",
        }}
      >
        {workspaceList.length > 0 &&
          workspaceList.map((Workspace, id) => (
            <motion.div
              initial={{ backgroundColor: "#FFFFFF" }}
              animate={{
                backgroundColor:
                  Workspace.workspaceId == wsIdx ? "#DEFED9" : "#FFFFFF",
              }}
              key={Workspace.workspaceId}
              whileHover={{
                backgroundColor:
                  Workspace.workspaceId == wsIdx ? "#DEFED9" : "#acacac",
              }}
              ref={(el) => (refs.current[Workspace.workspaceId] = el)}
              onClick={() =>
                selIdx(Workspace.workspaceName, Workspace.workspaceId)
              }
              css={{
                display: "flex",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor:
                  Workspace.workspaceId == wsIdx ? "#DEFED9" : "#FFFFFF",
              }}
            >
              <img
                className="side-nav-end-image"
                src={Workspace.workspaceImage}
                alt="얼굴"
                height={50}
                width={50}
                css={{
                  float: "left",
                  marginTop: "3px",
                  marginLeft: "5px",
                  /* margin-bottom: 5px; */
                  marginRight: "10px",
                  borderRadius: "30%",
                }}
              />
              <motion.div
                css={{
                  margin: "5px 0px",
                  width: "210px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <motion.p
                  className={isHovering ? "hover" : ""}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                  css={{
                    marginLeft: "10px",
                    flex: "3",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {Workspace.workspaceName}
                </motion.p>
                {Workspace.workspaceId == wsIdx && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{
                      scale: 0.8,
                      rotate: -45,
                      borderRadius: "100%",
                    }}
                    css={{
                      backgroundColor: "#91C8E4",
                      borderRadius: "15px",
                      borderWidth: "0px",
                      marginRight: "5px",
                      width: "55px",
                      height: "55px",
                    }}
                    onClick={open}
                  >
                    초대
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          ))}
        {/* <p>baby_on_top</p>
                <p>jungle_blue</p>
                <p>pintos_study</p>
                <p>프론트엔드 스터디</p>
                <p>정글 2기</p> */}

        {modalOpen && (
          <InviteModal
            modalOpen={modalOpen}
            open={open}
            close={close}
            workspaceId={wsIdx}
          />
        )}
        {isUnlink && (
          <UnlinkCheckModal setIsUnlink={setIsUnlink} unlink={unlink} />
        )}
      </motion.div>
      <div css={{ display: "flex", flex: 1 }}>
        <WorkSpaceModal isUpdate={isUpdate} setIsUpdate={setIsUpdate} />
      </div>
    </div>
  );
}
