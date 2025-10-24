import { IconArrowNarrowRight, IconDownload } from "@tabler/icons-react"
import { useState, useRef, useId, useEffect } from "react"

const Slide = ({ slide, index, current, handleSlideClick }) => {
  const slideRef = useRef(null)
  const xRef = useRef(0)
  const yRef = useRef(0)
  const frameRef = useRef()

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return

      const x = xRef.current
      const y = yRef.current

      slideRef.current.style.setProperty("--x", `${x}px`)
      slideRef.current.style.setProperty("--y", `${y}px`)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (event) => {
    const el = slideRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2))
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2))
  }

  const handleMouseLeave = () => {
    xRef.current = 0
    yRef.current = 0
  }

  const imageLoaded = (event) => {
    event.currentTarget.style.opacity = "1"
  }

  const { src, button, stageNumber } = slide

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[60vmin] h-[60vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] rounded-[1%] overflow-hidden transition-all duration-150 ease-out"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          <img
            className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-0 transition-opacity duration-600 ease-in-out"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            alt={`Stage ${stageNumber}`}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          {current === index && (
            <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
          )}
        </div>

        <article
          className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${current === index ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
          <div className="flex justify-center">
            <a
              href={src}
              download={`giai-doan-${stageNumber}.jpg`}
              className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
            >
              <IconDownload className="mr-2" size={16} />
              {button}
            </a>
          </div>
        </article>
      </li>
    </div>
  )
}

const CarouselControl = ({ type, title, handleClick }) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-[#6D64F7] focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${type === "previous" ? "rotate-180" : ""
        }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  )
}

const CollectionModal = ({ isOpen, onClose, completedCheckpoints }) => {
  const [current, setCurrent] = useState(0)

  // Tạo slides chỉ từ các giai đoạn đã hoàn thành
  const allStages = [
    {
      src: "/stage1/giaidoan1.jpg",
      button: "Tải về",
      stageNumber: 1,
      title: "Ánh sáng của thời đại mới",
      year: "1945 – 1954",
      meaning: "Bức tranh khắc họa khoảnh khắc lịch sử thiêng liêng khi nhân dân Việt Nam dưới lá cờ đỏ sao vàng, lắng nghe Chủ tịch Hồ Chí Minh tuyên bố độc lập – biểu tượng cho sự ra đời của nhà nước kiểu mới “của dân, do dân, vì dân”, đặt nền tảng chính trị – tư tưởng cho con đường đi lên chủ nghĩa xã hội ở Việt Nam"
    },
    {
      src: "/stage2/giaidoan2.jpg",
      button: "Tải về",
      stageNumber: 2,
      title: "Hai miền – Một lý tưởng",
      year: "1954 – 1975",
      meaning: "Bức tranh thể hiện sức mạnh thống nhất biện chứng giữa hai nhiệm vụ cách mạng: miền Bắc tiến hành xây dựng chủ nghĩa xã hội – nền tảng vật chất, còn miền Nam kiên cường đấu tranh giải phóng – tiền tuyến của lý tưởng độc lập và CNXH"
    },
    {
      src: "/stage3/giaidoan3.png",
      button: "Tải về",
      stageNumber: 3,
      title: "Cả nước đi lên chủ nghĩa xã hội – Những năm tháng bao cấp",
      year: "1975 – 1986",
      meaning: "Bức tranh tái hiện giai đoạn cả nước bước vào xây dựng CNXH sau thống nhất, với niềm tin và khát vọng lớn lao, nhưng trong khuôn khổ cơ chế kế hoạch hóa tập trung – biểu hiện rõ mâu thuẫn giữa ý chí cách mạng và trình độ phát triển vật chất"
    },
    {
      src: "/stage4/giaidoan4.png",
      button: "Tải về",
      stageNumber: 4,
      title: "Đổi mới",
      year: "1986 – 2010",
      meaning: "Bức tranh khắc họa tinh thần Đổi mới – sự chuyển biến biện chứng từ cơ chế kế hoạch hóa bao cấp sang kinh tế thị trường định hướng xã hội chủ nghĩa, phản ánh quy luật phủ định của phủ định trong tiến trình phát triển của cách mạng Việt Nam"
    },
    {
      src: "/stage5/giaidoan5.png",
      button: "Tải về",
      stageNumber: 5,
      title: "Việt Nam trong kỷ nguyên hội nhập và trí tuệ số",
      year: "2010 – nay",
      meaning: "Bức tranh thể hiện tầm vóc mới của Việt Nam trong thời kỳ toàn cầu hóa và cách mạng công nghiệp 4.0 – giai đoạn phát triển tất yếu của quá trình quá độ lên CNXH, khi khoa học – công nghệ, trí tuệ con người và hợp tác quốc tế trở thành lực lượng sản xuất trực tiếp, quyết định sức mạnh của quốc gia"
    },
  ]

  // Lọc chỉ các giai đoạn đã hoàn thành
  const slides = allStages.filter((_, index) => completedCheckpoints.includes(index))

  const handlePreviousClick = () => {
    const previous = current - 1
    setCurrent(previous < 0 ? slides.length - 1 : previous)
  }

  const handleNextClick = () => {
    const next = current + 1
    setCurrent(next === slides.length ? 0 : next)
  }

  const handleSlideClick = (index) => {
    if (current !== index) {
      setCurrent(index)
    }
  }

  const id = useId()

  if (!isOpen || slides.length === 0) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-transparent w-[90vw] h-[90vh] flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-50 shadow-lg"
        >
          <span className="text-gray-800 text-xl font-bold">×</span>
        </button>

        {/* Header - Compact */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            📚 Bộ sưu tập giai đoạn
          </h2>
          <p className="text-white/80 text-sm drop-shadow-md">
            Các giai đoạn bạn đã hoàn thành ({slides.length}/5)
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto mb-4" style={{ height: 'calc(60vmin + 4rem)', width: '100%' }}>
          {/* Carousel */}
          <div
            className="relative w-[60vmin] h-[60vmin] mx-auto"
            aria-labelledby={`carousel-heading-${id}`}
          >
            <ul
              className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${current * (100 / slides.length)}%)`,
              }}
            >
              {slides.map((slide, index) => (
                <Slide
                  key={index}
                  slide={slide}
                  index={index}
                  current={current}
                  handleSlideClick={handleSlideClick}
                />
              ))}
            </ul>

            {/* Navigation Controls - chỉ hiển thị nếu có nhiều hơn 1 slide */}
            {slides.length > 1 && (
              <div className="absolute flex justify-center w-full" style={{ top: 'calc(60vmin + 1rem)' }}>
                <CarouselControl
                  type="previous"
                  title="Giai đoạn trước"
                  handleClick={handlePreviousClick}
                />

                <CarouselControl
                  type="next"
                  title="Giai đoạn tiếp theo"
                  handleClick={handleNextClick}
                />
              </div>
            )}
          </div>
        </div>

        {/* Stage Indicator */}
        <div className="text-center">
          <p className="text-white font-semibold drop-shadow-lg mb-2">
            Giai đoạn {current + 1} ({slides[current]?.year})
          </p>
          <p className="text-white/90 text-lg font-medium drop-shadow-md">
            {slides[current]?.title}
          </p>
          <p className="text-white/90 text-sm font-medium drop-shadow-md">
            {slides[current]?.meaning}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CollectionModal
