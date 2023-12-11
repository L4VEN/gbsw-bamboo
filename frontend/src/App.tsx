// App.tsx

import React, { useState, useEffect, useRef } from "react";
import Report from "./Report";
import axios from "axios";
import GbswChar from "../src/img/gbsw_char.png";

// Post 인터페이스 정의
interface Post {
  createdAt: Date;
  id: number;
  title: string;
  description: string;
  name: string;
  password: string;
  categories: string;
}

const App: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [postData, setPostData] = useState<Post[]>([]);
  const [formData, setFormData] = useState<Post>({
    id: 0,
    title: "",
    description: "",
    name: "",
    password: "",
    createdAt: new Date(),
    categories: "유머",
  });

  const [visiblePostCount, setVisiblePostCount] = useState(10);

  useEffect(() => {
    // 페이지 로드 시 GET 요청 수행
    axios
      .get<Post[]>("http://localhost:3000/api/boards")
      .then((response) => {
        setPostData(response.data.reverse());
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  }, []);

  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePostCount < postData.length) {
          // 화면에 로딩 요소가 나타나고, 더 로딩할 포스트가 남아있을 때 추가 컴포넌트 로딩
          setVisiblePostCount((prevCount) =>
            Math.min(prevCount + 10, postData.length)
          );
        }
      },
      { threshold: [1] }
    );

    const loadingElement = loadingRef.current;

    if (loadingElement) {
      observer.observe(loadingElement);
      console.log("Observer가 로딩 요소를 관찰 중입니다.");
    }

    return () => observer.disconnect(); // 컴포넌트 언마운트 시 Observer 해제
  }, [visiblePostCount, postData.length]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // POST 요청 수행
    axios
      .post<Post>("http://localhost:3000/api/boards", formData)
      .then((response) => {
        console.log("제보 성공:", response.data);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  };
  

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    // 입력 폼의 값이 변경될 때마다 상태 업데이트
    if (e.target.value !== "none") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  

  return (
    <>
      <div className={`background ${isDarkTheme ? "dark-theme" : ""}`}></div>
      <div className={`inner ${isDarkTheme ? "dark-theme" : ""}`}>
        <img src={GbswChar} className="gbsw-logo" alt="Logo" />
        <header>
          <h3>
            <div>경</div>소고<div>&nbsp;대</div>나무<div>숲</div>
          </h3>
          <div onClick={toggleTheme} className="theme-btn">
            {isDarkTheme ? "밝은 테마" : "어두운 테마"}
          </div>
        </header>
        <form
          onSubmit={handleSubmit}
          className={`${isDarkTheme ? "dark-theme" : ""}`}
        >
          <div className="input-container">
            <input
              type="text"
              placeholder="제목 (최대 20자)"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className={`${isDarkTheme ? "dark-theme" : ""}`}
            />
            <input
              type="text"
              placeholder="이름"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`${isDarkTheme ? "dark-theme" : ""}`}
            />
            <input
              type="password"
              placeholder="비밀번호"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`${isDarkTheme ? "dark-theme" : ""}`}
            />
            <select
              id="categories"
              value={formData.categories}
              onChange={handleChange}
              className={`${isDarkTheme ? "dark-theme" : ""}`}
            >
              <option value="none">태그 선택</option>
              <option value="유머">유머</option>
              <option value="개인">개인</option>
              <option value="궁금증">궁금증</option>
              <option value="진로진학">진로진학</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <input
              type="text"
              placeholder="설명"
              id="description"
              value={formData.description}
              onChange={handleChange}
              className={`${isDarkTheme ? "dark-theme" : ""}`}
            />
          <button
            type="submit"
            className={`${isDarkTheme ? "dark-theme" : ""}`}
          >
            제보하기
          </button>
          {isSubmitted && (
            <div className="submit-check">
              제보가 성공적으로 완료되었습니다!
            </div>
          )}
        </form>
        <div id="post-container">
          {postData.slice(0, visiblePostCount).map((post, index) => (
            <Report
              date={post.createdAt}
              text={post.description}
              tag={post.categories}
              key={post.id}
              {...post}
              isDarkTheme={isDarkTheme}
            />
          ))}
        </div>
        <div ref={loadingRef} style={{ height: "10px" }}>
          {/* 로딩 표시용 div */}
        </div>
      </div>
    </>
  );
};

export default App;
function loadMore() {
  throw new Error("Function not implemented.");
}

