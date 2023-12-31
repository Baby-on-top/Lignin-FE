/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { SelectedWsIdx, recoilBoardList } from "../../utils/atoms";
import { useRecoilState } from "recoil";
import {
  boardJoin,
  boardInvite,
  boardEdit,
  boardDelete,
  boardLeave,
} from "../../utils/apis";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion, useAnimate, stagger } from "framer-motion";

export default function DropDown({ id }) {
  const boardId = id;
  const [isActive, setIsActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalActive, setModalActive] = useState("");

  const handleDropdownToggle = () => {
    console.log(id);
    setIsActive(!isActive);
  };

  // 모달 시작
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  // 모달 끝

  // invite 시작
  const [wsIdx, setWsIdx] = useRecoilState(SelectedWsIdx);
  const [userList, setUserList] = useState([]);
  const newUserList = [];
  const searchBoard = async () => {
    try {
      const response = await boardJoin(wsIdx);
      // console.log(response.data);
      // let newUserList = []
      setUserList(response.data);
      //   for (var i = 0; i < response.data.length; i++) {
      //     console.log(response.data[i]);
      //     setUserList(userList.concat(response.data[i]));
      //   }
      return response.data;
    } catch (e) {
      console.error(e);
    }
  };

  async function search(e) {
    if (e) {
      e.preventDefault();
    }
    const data = await searchBoard();
    return data;
  }

  const [userId, setUserId] = useState("");
  const inviteBoard = async () => {
    try {
      const response = await boardInvite(boardId, userId);

      return response;
    } catch (e) {
      console.error(e);
    }
  };

  async function invite(e) {
    if (e) {
      e.preventDefault();
    }
    const data = await inviteBoard();
    return data;
  }

  const [userInput, setUserInput] = useState("");

  // 마지막에 유저정보 초기화
  const deleteUserId = () => {
    setUserId("");
  };

  const getValue = (e) => {
    setUserInput(e.target.value);
  };

  const searched = userList.filter((item) => item.name.includes(userInput));

  useEffect(() => {
    search();
  }, []);
  // invite 끝

  // edit 시작
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  const handletitle = (event) => {
    event.preventDefault();
    setTitle(event.target.value);
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (e.target.files) {
      const uploadImage = e.target.files[0];
      formData.append("image", uploadImage);
      setImage(uploadImage);
    }
  };

  const handleDelete = () => {
    URL.revokeObjectURL(image);
    setImage();
    setModal(!modal);
  };

  const editBoard = async () => {
    try {
      const response = await boardEdit(image, title, boardId);
      //   setChk(true);
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  async function editInfo(e) {
    if (e) {
      e.preventDefault();
    }
    const data = await editBoard();
    return data;
  }

  const [boardList, setBoardList] = useRecoilState(recoilBoardList);

  const reEditBoard = async (data) => {
    const boardListIdx = boardList.findIndex((el) => el.boardId == boardId);
    const newBoardList = boardList
      .slice(0, boardListIdx)
      .concat(data.data)
      .concat(boardList.slice(boardListIdx + 1));
    // setBoardList(newBoardList);
    let res = []
    if (newBoardList.length > 0) {
      let tmpList = [...newBoardList]
      res = tmpList.sort((a,b) => b.updateAt.localeCompare(a.updateAt))
    }
    await setBoardList(res)
  };
  // edit 끝

  // delete 시작
  const deleteBoard = async () => {
    try {
      const response = await boardDelete(boardId);
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  async function deleteInfo(e) {
    if (e) {
      e.preventDefault();
    }
    const data = await deleteBoard();
    return data;
  }

  const reDeleteBoard = async (data) => {
    setBoardList(
      boardList.filter((boardList) => boardList.boardId !== boardId)
    );
  };
  // delete 끝

  // leave 시작
  const [cookies] = useCookies(["cookies"]);
  const leaveBoard = async () => {
    try {
      const response = await boardLeave(cookies, boardId);
      return response;
    } catch (e) {
      console.error(e);
    }
  };

  async function leave(e) {
    if (e) {
      e.preventDefault();
    }
    const data = await leaveBoard();
    return data;
  }

  const reLeaveBoard = async (data) => {
    setBoardList(
      boardList.filter((boardList) => boardList.boardId !== boardId)
    );
  };

  return (
    <>
      <EllipsisVerticalIcon
        onClick={handleDropdownToggle}
        width={30}
        height={30}
        css={
          {
            // display: 'inline-block',
            // height: '20px',
            // verticalAlign: 'top',
            //marginTop: "-20px",
          }
        }
      ></EllipsisVerticalIcon>
      {isActive && (
        <div
          onClick={handleDropdownToggle}
          className="overlay"
          css={{
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "fixed",
            // background: 'rgba(49,49,49,0.8)',
          }}
        ></div>
      )}
      {isActive && (
        <div
          css={{
            position: "absolute",
            float: "right",
            borderRadius: "8px",
            width: "7%",
            fontsize: "1rem",
            // zIndex: '-1px',
            // padding: '0px',
            marginTop: "220px",
            // marginRight: "30px",
            boxShadow: '0 4px 18px 0 rgba(0, 0, 0, 0.25)',
            transition: '0.5s ease-out',
            overflow: 'visible',
          }}
        >
          <ul
            onClick={handleDropdownToggle}
            css={{
              display: "block",
              marginTop: "0px",
              marginBottom: "0px",
              textAlign: "center",
              listStyle: "none",
              zIndex: "30px",
              // border: '3px solid white',
              // borderRadius: '15px',
              // padding: "5px",
            }}
          >
            <li
              onClick={async () => {
                await setModalActive("first");
                await toggleModal();
              }}
              css={{
                paddingLeft: '37px',
                borderRadius: '13px 13px 0px 0px',
                fontFamily: "Noto Sans KR"
              }}
            >
              보드초대
            </li>
            <hr
              css={{
                margin: "0px",
              }}
            />
            <li
              onClick={async () => {
                await setModalActive("second");
                await toggleModal();
              }}
              css={{
                paddingLeft: '37px',
                borderRadius: '0px',
                fontFamily: "Noto Sans KR",
              }}
            >
              보드수정
            </li>
            <hr
              css={{
                margin: "0px",
              }}
            />
            <li
              onClick={async () => {
                await setModalActive("third");
                await toggleModal();
              }}
              css={{
                paddingLeft: '37px',
                borderRadius: '0px',
                fontFamily: "Noto Sans KR",
              }}
            >
              보드삭제
            </li>
            <hr
              css={{
                margin: "0px",
              }}
            />
            <li
              onClick={async () => {
                await setModalActive("forth");
                await toggleModal();
              }}
              css={{
                paddingLeft: '37px',
                borderRadius: '0px 0px 13px 13px',
                fontFamily: "Noto Sans KR",
              }}
            >
              보드탈퇴
            </li>
          </ul>
        </div>
      )}
      {modal && modalActive === "first" && (
        <div
          className="modal"
          css={{
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            position: "fixed",
            zIndex : "5",
          }}
        >
          <div
            onClick={() => {
              toggleModal();
              deleteUserId();
            }}
            className="overlay"
            css={{
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              background: 'rgba(255,255,255,0.9)',
            }}
          ></div>
          <div
            className="modal-content"
            css={{
              width: '450px',
              background: 'linear-gradient(180deg, #DCF9E0 0%, #FFFFFF 30.21%)',
              boxShadow: '0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '1.4',
              padding: '14px 28px',
            }}
          >
            <div className="modal-top">
              <div
                css={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '30px',
                  marginBottom: '5px',
                  marginLeft: '5px',
                  fontSize: "24px",
                  fontFamily: "Noto Sans KR",
                }}
              >
                보드 초대하기
              </div>
              <XMarkIcon onClick={() => {
                toggleModal();
                deleteUserId();
              }}
              width={30} height={30} css={{
                float: 'right',
                marginTop:'33px',
              }}></XMarkIcon>
              <input
                className="modal-title"
                type="text"
                placeholder="멤버 이름 또는 이메일"
                onChange={getValue}
                css={{
                  width: "392px",
                  height: "35px",
                  border: "2px solid rgba(173, 169, 169, 0.5)",
                  outline: "none",
                  borderRadius: "10px",
                  marginTop: "20px",
                  marginBottom: "5px",
                }}
              />
              {/* {
                  userList.map((userInfo) => (
                    <div key={userInfo.memberId}>
                      <p>{userInfo.name}</p>
                      <img src={userInfo.profile} />
                    </div>
                  ))
                } */}
              {searched.map((item) => {
                return (
                  // <div key={item.memberId}>
                  //   <input
                  //     type="radio"
                  //     onChange={() => setUserId(item.memberId)}
                  //   />
                  //   {item.name}
                  // </div>
                  <motion.div
                    initial={{ backgroundColor: "#FFFFFF" }}
                    animate={{
                      backgroundColor:
                        item.memberId == userId ? "#DEFED9" : "#FFFFFF",
                    }}
                    key={item.memberId}
                    whileHover={{
                      backgroundColor:
                        item.memberId == userId ? "#DEFED9" : "#acacac",
                    }}
                    // ref={(el) => (refs.current[Workspace.workspaceId] = el)}
                    onClick={() => setUserId(item.memberId)}
                    css={{
                      // display: "flex",
                      // alignItems: "center",
                      padding: "10px 20px",

                      backgroundColor:
                        item.memberId == userId ? "#DEFED9" : "#FFFFFF",
                    }}
                  >
                    <img
                      className="invite-profile"
                      src={item.profile}
                      alt="이미지"
                      css={{
                        // marginTop: "10px",
                        marginBottom: "-5px",
                        width: "5%",
                        maxHeight: "28px",
                        height: "5%",
                        // float: "left",
                        borderRadius: "50px",
                        // height: "300px",
                        // outline: "none",
                        // borderRadius: "3px",
                      }}
                    ></img>
                    <p
                      css={{
                        display: "inline",
                        marginLeft: "15px",
                        marginBottom: "10px",
                        fontSize: "20px",
                        fontWeight: "normal",
                      }}
                    >
                      {item.name + "(" + item.email + ")"}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {userId != "" ? (
              <button
                className="modal-save-after"
                type="submit"
                onClick={async () => {
                  const inviteData = await invite();
                  toggleModal();
                  deleteUserId();
                }}
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '40px',
                  boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                  borderRadius: '7px',
                  border: '0',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100px',
                  margin: 'auto',
                  marginTop: '25px',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  fontFamily: "Noto Sans KR",
                  background: '#00AB59',
                }}
              >
                초대
              </button>
            ) : (
              <button
                className="modal-save-after"
                type="submit"
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '40px',
                  boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                  borderRadius: '7px',
                  border: '0',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100px',
                  margin: 'auto',
                  marginTop: '25px',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  fontFamily: "Noto Sans KR",
                  backgroundColor: "rgba(173, 169, 169, 0.5)",
                }}
              >
                초대
              </button>
            )}
          </div>
        </div>
      )}
      {modal && modalActive === "second" && (
        <div
          className="modal"
          css={{
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            position: "fixed",
            zIndex : "5",
          }}
        >
          <div
            onClick={handleDelete}
            className="overlay"
            css={{
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              background: 'rgba(255,255,255,0.9)',
            }}
          ></div>
          <div
            className="modal-content"
            css={{
              width: '450px',
              background: 'linear-gradient(180deg, #DCF9E0 0%, #FFFFFF 30.21%)',
              boxShadow: '0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '1.4',
              padding: '14px 28px',
            }}
          >
            <div className="modal-top">
              <div
                className="modal-name"
                css={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '30px',
                  marginBottom: '15px',
                  marginLeft: '5px',
                  fontSize: "24px",
                  fontFamily: "Noto Sans KR",
                }}
              >
                Board Edit
              </div>
              <XMarkIcon onClick={handleDelete} width={30} height={30} css={{
                float: 'right',
                marginTop: '33px',
              }}></XMarkIcon>
            </div>
            <input
              className="modal-title"
              type="text"
              placeholder=" Title"
              onChange={handletitle}
              css={{
                width: "400px",
                height: '40px',
                border: "2px solid rgba(173, 169, 169, 0.5)",
                outline: "none",
                borderRadius: "10px",
              }}
            />
            <div onClick={handleImageClick}>
              {image ? (
                <img
                  className="modal-add-cover"
                  src={URL.createObjectURL(image)}
                  alt="이미지"
                  css={{
                    marginTop: "20px",
                    width: "400px",
                    height: "300px",
                    border: "2px solid rgba(173, 169, 169, 0.5)",
                    outline: "none",
                    borderRadius: "10px",
                  }}
                ></img>
              ) : (
                <input
                  className="modal-add-cover"
                  placeholder=" Add Cover"
                  css={{
                    marginTop: "20px",
                    width: "400px",
                    height: "300px",
                    border: "2px solid rgba(173, 169, 169, 0.5)",
                    outline: "none",
                    borderRadius: "13px",
                  }}
                ></input>
              )}
              <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
              ></input>
            </div>

            {title && image ? (
              <button
                className="modal-save-after"
                type="submit"
                onClick={async () => {
                  const editData = await editInfo();
                  toggleModal();
                  handleDelete();
                  await reEditBoard(editData);
                }}
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '40px',
                  boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                  borderRadius: '7px',
                  border: '0',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100px',
                  margin: 'auto',
                  marginTop: '25px',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  background: '#00AB59',
                }}
              >
                저장
              </button>
            ) : (
              <button
                className="modal-save-before"
                css={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '40px',
                  background: '#0bdd12',
                  boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                  borderRadius: '7px',
                  border: '0',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100px',
                  margin: 'auto',
                  marginTop: '25px',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(173, 169, 169, 0.5)',
                }}
              >
                저장
              </button>
            )}
          </div>
        </div>
      )}
      {modal && modalActive === "third" && (
        <div
          className="modal"
          css={{
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            position: "fixed",
            zIndex : "5",
          }}
        >
          <div
            onClick={toggleModal}
            className="overlay"
            css={{
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              background: "rgba(255,255,255,0.9)",
            }}
          ></div>
          <div
            className="modal-content"
            css={{
              width: '450px',
              background: 'linear-gradient(180deg, #DCF9E0 0%, #FFFFFF 30.21%)',
              boxShadow: '0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '1.4',
              padding: '14px 28px',
            }}
          >
            <div className="modal-top">
              <div
                className="modal-name"
                css={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '30px',
                  marginBottom: '25px',
                  marginLeft: '5px',
                  fontSize: "24px",
                  fontFamily: "Noto Sans KR",
                }}
              >
                선택한 보드를 삭제하시겠습니까?
              </div>
              <XMarkIcon onClick={toggleModal} width={30} height={30} css={{
                float: 'right',
                marginTop: '31px',
              }}></XMarkIcon>
            </div>

            <button
              className="modal-save-after"
              type="submit"
              onClick={async () => {
                const deleteData = await deleteInfo();
                toggleModal();
                await reDeleteBoard(deleteData);
              }}
              css={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40px',
                boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                borderRadius: '7px',
                border: '0',
                outline: 'none',
                color: '#ffffff',
                width: '100px',
                margin: 'auto',
                marginTop: '25px',
                marginBottom: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
                fontFamily: "Noto Sans KR",
                background: '#00AB59',
              }}
            >
              삭제
            </button>
          </div>
        </div>
      )}

      {modal && modalActive === "forth" && (
        <div
          className="modal"
          css={{
            width: "100vw",
            height: "100vh",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            position: "fixed",
            zIndex : "5",
          }}
        >
          <div
            onClick={toggleModal}
            className="overlay"
            css={{
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: "fixed",
              background: "rgba(255,255,255,0.9)",
            }}
          ></div>
          <div
            className="modal-content"
            css={{
              width: '450px',
              background: 'linear-gradient(180deg, #DCF9E0 0%, #FFFFFF 30.21%)',
              boxShadow: '0px 187px 75px rgba(0, 0, 0, 0.01), 0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09), 0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              lineHeight: '1.4',
              padding: '14px 28px',
            }}
          >
            <div className="modal-top">
              <div
                className="modal-name"
                css={{
                  display: 'inline-block',
                  float: 'left',
                  marginTop: '30px',
                  marginBottom: '15px',
                  marginLeft: '5px',
                  fontSize: "24px",
                  fontFamily: "Noto Sans KR",
                }}
              >
                선택한 보드에서 떠나시겠습니까?
              </div>
              <XMarkIcon onClick={toggleModal} width={30} height={30} css={{
                float: 'right',
                marginTop: '31px',
              }}></XMarkIcon>
            </div>

            <button
              className="modal-save-after"
              type="submit"
              onClick={async () => {
                const leaveData = await leave();
                toggleModal();
                await reLeaveBoard(leaveData);
              }}
              css={{
                display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '40px',
                  boxShadow: '0px 0.5px 0.5px #EFEFEF, 0px 1px 0.5px rgba(239, 239, 239, 0.5)',
                  borderRadius: '7px',
                  border: '0',
                  outline: 'none',
                  color: '#ffffff',
                  width: '100px',
                  margin: 'auto',
                  marginTop: '25px',
                  marginBottom: '10px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  background: '#00AB59',
              }}
            >
              탈퇴
            </button>
          </div>
        </div>
      )}
    </>
  );
}
