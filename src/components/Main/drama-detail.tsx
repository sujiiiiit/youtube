import { Link } from "react-router-dom";
import AddPlayListIcon from "../../assets/icons/add_playlist";
import ShareIcon from "../../assets/icons/share";
import PlayIcon from "../../assets/icons/play";
import DownloadIcon from "../../assets/icons/download";
import { useState } from "react";

const DramaDetail = () => {
  const [isClamped, setIsClamped] = useState(true);

  const handleToggleClamp = () => {
    setIsClamped(!isClamped);
  };
  return (
    <>
      <div className="w-full h-[calc(100dvh_-_var(--header-height))] flex flex-row gap-4  xs:flex-col px-4 xs:p-0 mt-[var(--grid-padding)] xs:mt-0 overflow-auto">
        <div className="flex flex-col sticky top-0 xs:relative z-20 box-border w-full 	  max-w-sm xs:max-w-none rounded-2xl xs:rounded-none">
          <div className="absolute left-0 w-full flex-1 p-6 rounded-16 mb-6 rounded-2xl xs:rounded-none overflow-hidden flex">
            <div>
              <div className=" z-30 img_shadow  opacity-70 blur-[30px] flex justify-center">
                <img
                  className="w-full h-auto"
                  src="/assets/img.png"
                  alt="demo"
                />
              </div>
              <div
                className="absolute z-[31] top-0 right-0 bottom-0 left-0"
                style={{ background: "var(--detail-gradient)" }}
              ></div>
            </div>
          </div>
          <div className=" relative z-[32]  rounded-xl p-4">
            <img
              className="aspect-[16/9] object-cover w-full rounded-xl"
              src="/assets/img.png"
              alt="demo"
            />
          </div>
          <div className="relative z-[32] m-6 mt-0">
            <div className="main_title text-Primary font-bold text-xl line-clamp-2">
              ENG SUB 【Ancient Love Poetry 千古玦尘】 🧊Starring: Zhou Dongyu
              blabla
            </div>
            <div className="w-full mb-3">
              <div className=" mt-4 text-sm font-normal  line-clamp-1  text-Primary mb-1">
                By Deng Ke 邓科 - 37 vidoes
              </div>
              <div className="text-xs font-normal  line-clamp-2  text-Secondary dark:text-white/70">
                Action, Adventure, Demon, Fantasy, Historical,Martial Arts,
                Novel, Romance, Wuxia.
              </div>
            </div>
            <div className="w-full my-4 flex gap-2">
              <button className=" group z-[32] relative detailBtn iconBtn hover:!bg-transparent ">
                <div className="absolute z-[1] top-0 left-0 bottom-0 right-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-full "></div>
                <AddPlayListIcon className="z-[2]" />
              </button>
              <button className=" group z-[32] relative detailBtn iconBtn hover:!bg-transparent ">
                <div className="absolute z-[1] top-0 left-0 bottom-0 right-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-full "></div>
                <ShareIcon className="z-[2]" />
              </button>
            </div>
            <div className="w-full  flex flex-nowrap relative z-[32] gap-2">
              <Link
                to={"#"}
                className="w-full h-10 outline-0 border-0 bg-Primary relative rounded-full flex flex-nowrap items-center justify-center"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-3xl z-[1]"></div>
                <div className="dark:text-black h-10 text-white  flex justify-center items-center gap-1 text-sm px-4  rounded-3xl 	">
                  <span className="flex mb-[1.5px] items-center">
                    <PlayIcon className="fill-white dark:fill-black" />
                  </span>
                  <span className="flex h-10 items-center flex-nowrap text-nowrap whitespace-nowrap">
                    Play All
                  </span>
                </div>
              </Link>
              <Link
                to={"#"}
                className="w-full h-10 outline-0 border-0 bg-transparent relative rounded-full flex flex-nowrap items-center justify-center"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-3xl z-[1]"></div>
                <div className="text-Primary  flex justify-center items-center gap-1 text-sm px-4  rounded-3xl 	">
                  <span className="flex h-10 items-center">
                    <DownloadIcon className="" />
                  </span>
                  <span className="flex h-10 items-center flex-nowrap text-nowrap whitespace-nowrap">
                    Download
                  </span>
                </div>
              </Link>
            </div>
            <div
              onClick={handleToggleClamp}
              className={`desc my-4 text-Secondary text-justify text-sm cursor-pointer ${
                isClamped ? "line-clamp-4 mdd:line-clamp-2" : ""
              }`}
            >
              In ancient times, many gods died but only one last deity Xing Zhi
              survived. Without emotion or desire, Emperor Xing Zhi had been
              living beyond the sky for tens of thousands of years. In a war
              between the gods and the demons, he saved the situation by himself
              alone. But after that, he refused to see anyone and was nowhere to
              be found. Several hundred years later, a female demon lord Shen Li
              was born with a pearl in her mouth.
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col ">
  {Array.from({ length: 12 }).map((_, index) => (
    <Link
      key={index}
      to={"#"}
      className="group flex flex-row flex-nowrap hover:bg-[var(--hover-color)] p-1 rounded-xl  xs:rounded-none"
    >
      <div className="list_no flex justify-center items-center px-2 text-Secondary">
        {index + 1}
      </div>
      <div className="list_detail flex">
        <div className="img aspect-[16/9] w-full min-w-40  max-w-52">
          <img
            src="/assets/img.png"
            alt="demo"
            className="aspect-[16/9] object-cover rounded-xl"
          />
        </div>
        <div className="list_tite  text-base xs:text-sm xs:font-normal  font-bold text-Primary">
          <span className="line-clamp-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nesciunt odit laboriosam tenetur temporibus ducimus tempora dolorem in sint perspiciatis!</span>
        </div>
      </div>
    </Link>
  ))}
</div>

      </div>
    </>
  );
};

export default DramaDetail;
