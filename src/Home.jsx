import React from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faTerminal,
  faVideo,
  faGaugeHigh,
  faUsers,
  faShieldHalved,
  faChalkboardUser,
  faPencilRuler,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();

  return (
    // Main container with a light background
    <div className="h-[90vh] transition-all duration-150 bg-gradient-to-b from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-950">
  <Parallax pages={6} className="top-0 left-0 w-full h-full">
    {/* 🔷 Layer 0 — Titles */}
    <ParallaxLayer
      offset={0}
      speed={0.9}
      className="absolute flex flex-col justify-start text-center pt-24 md:pt-32 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]"
    >
      <h1 className="quicksand-normal text-slate-800 dark:text-white text-8xl md:text-9xl">
        Welcome to
      </h1>
      <h1 className="quicksand-normal text-slate-800 dark:text-white text-7xl md:text-8xl">
        Quizz Craft
      </h1>
    </ParallaxLayer>

    {/* 🖼️ Owl + Button */}
    <ParallaxLayer
      offset={0}
      speed={1.2}
      className="absolute flex flex-col items-center justify-end text-center pb-5"
    >
      <img
        src="/op.png"
        alt="Wise owl mascot"
        className="w-auto h-[40vh] md:h-[55vh]"
      />
      <button
        type="button"
        className="absolute text-white z-10 py-3 px-8 mb-4 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-colors duration-300"
        onClick={() => navigate("/MakeQuiz")}
      >
        Generate Quiz
      </button>
    </ParallaxLayer>

    {/* ❓ How It Works */}
    <ParallaxLayer
      offset={1}
      speed={0.8}
      className="flex justify-center items-center text-center bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900"
    >
      <div className="flex flex-col items-center">
        <h2 className="quicksand-normal text-5xl md:text-6xl text-slate-300 dark:text-white">
          How It Works?
        </h2>
        <p className="text-red-600 dark:text-red-400 mt-2">
          Unleash the Power of PDFs in Quiz Building!
        </p>
      </div>
    </ParallaxLayer>

    {/* 🧠 Feature Cards */}
    <ParallaxLayer offset={1.3} speed={1.2} className="flex justify-center items-center">
      <FeatureCards ClassName="bg-white/70 dark:bg-gray-800 backdrop-blur-sm p-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" />
    </ParallaxLayer>
    {/* <ParallaxLayer offset={1.9} speed={1.2} className="h-fit bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900"/> */}

    {/* 🚀 Call to Action */}
    <ParallaxLayer
      offset={2}
      speed={0.8}
      className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]"
    >
      <h2 className="quicksand-normal text-5xl md:text-6xl text-gray-800 dark:text-white mb-8">
        Ready to Begin?
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
        Join thousands of educators and learners who use Quizz Craft to create engaging and effective learning experiences.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          className="text-white text-lg z-10 py-3 px-8 font-bold rounded-full cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/MakeQuiz")}
        >
          Make a Quiz
        </button>
        <button
          type="button"
          className="text-gray-800 dark:text-white border-gray-800 dark:border-white text-lg z-10 py-3 px-8 font-bold rounded-full cursor-pointer bg-transparent border-2 hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/JoinQuiz")}
        >
          Join a Quiz
        </button>
      </div>
    </ParallaxLayer>

    {/* 🧐 Why Choose Section */}
    <ParallaxLayer
      offset={3}
      speed={0.8}
      className="flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900"
    >
      <h2 className="quicksand-normal text-5xl md:text-6xl text-slate-300 dark:text-white mb-8">
        Why Choose Quizz Craft?
      </h2>
    </ParallaxLayer>

    <ParallaxLayer offset={3.5} speed={1.2} className="flex justify-center items-center">
      <WhyChooseCards ClassName="bg-white/70 dark:bg-gray-800 backdrop-blur-sm p-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" />
    </ParallaxLayer>

    {/* 📚 Benefit Section */}
    <ParallaxLayer
      offset={4}
      speed={0.2}
      className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-gray-950 dark:to-gray-900 shadow-[0_-15px_25px_-10px_rgba(0,0,0,0.1)]"
    />
    <ParallaxLayer
      offset={4}
      speed={0.8}
      className="flex flex-col items-center justify-center text-center p-4"
    >
      <h2 className="quicksand-normal text-4xl md:text-5xl text-slate-800 dark:text-white mb-8">
        Who Can Benefit?
      </h2>
    </ParallaxLayer>
    <ParallaxLayer offset={4.5} speed={1.2} className="flex justify-center items-center">
      <BenefitCards ClassName="bg-white/70 dark:bg-gray-800 backdrop-blur-sm p-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" />
    </ParallaxLayer>

    {/* 🎉 Final CTA */}
    <ParallaxLayer
      offset={5}
      speed={0.5}
      className="bg-gradient-to-t from-slate-900 to-slate-800 dark:from-black dark:to-gray-900 flex flex-col items-center justify-center text-center p-4"
    >
      <h2 className="quicksand-normal text-4xl md:text-5xl text-white mb-4">
        Join the Quiz Revolution Today!
      </h2>
      <p className="text-indigo-200 dark:text-indigo-300 text-lg max-w-3xl mb-8">
        Elevate your content, engage your audience, and save valuable time.
      </p>
      <button
        type="button"
        onClick={() => navigate("/MakeQuiz")}
        className="text-white text-lg z-10 py-3 px-10 font-bold rounded-lg cursor-pointer bg-red-600 hover:bg-[#ae2929] transition-all duration-300 transform hover:scale-105"
      >
        Get Started Now
      </button>
      <p className="text-indigo-300 text-sm absolute bottom-4">
        © 2025 Quizz Craft
      </p>
    </ParallaxLayer>
  </Parallax>
</div>
  );
};

// FeatureCards component remains the same
// 🧠 Feature Cards
const FeatureCards = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Upload Your PDF:",
      icon: faFilePdf,
      description:
        "Simply upload your PDF document containing questions and answers. Our intelligent system will analyze the content and extract the quiz elements automatically.",
    },
    {
      title: "Customize Your Quiz:",
      icon: faTerminal,
      description:
        "Once the extraction is complete, you have the flexibility to customize your quiz, edit new ones, adjust difficulty levels, and make it uniquely yours.",
    },
    {
      title: "Generate Instantly:",
      icon: faVideo,
      description:
        "No more waiting! With a click of a button, generate your quiz in seconds. Share it with your audience, students, or colleagues effortlessly.",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center px-4">
      {features.map((feature, index) => (
        <button
          key={index}
          onClick={() => navigate("/MakeQuiz")}
          className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-6 rounded-2xl w-full md:w-1/4 h-64 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-101 cursor-pointer relative"
        >
          <FontAwesomeIcon
            icon={feature.icon}
            className="text-5xl mb-2 text-[#f73e00] group-hover:text-white transition-colors"
          />
          <h3 className="text-2xl font-bold quicksand-normal group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-slate-600 dark:text-gray-300 group-hover:text-slate-100 transition-colors">
            {feature.description}
          </p>
          <div className="absolute inset-0 bg-[#f73e00] dark:opacity-80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>
      ))}
    </div>
  );
};

// 🚀 Why Choose Cards
const WhyChooseCards = () => (
  <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center px-4">
    {[
      {
        title: "Versatility:",
        icon: faGaugeHigh,
        desc: "Accept quizzes in various formats, making it easy to integrate with your existing materials.",
      },
      {
        title: "User-Friendly Interface:",
        icon: faUsers,
        desc: "Our intuitive interface ensures a smooth experience, even for first-time users.",
      },
      {
        title: "Secure and Reliable:",
        icon: faShieldHalved,
        desc: "Rest assured, your data is handled with the utmost care. We prioritize security to protect your content and privacy.",
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-6 rounded-2xl w-full md:w-1/4 h-64 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-101 relative"
      >
        <FontAwesomeIcon icon={card.icon} className="text-5xl mb-2 text-[#f73e00]" />
        <h3 className="text-2xl font-bold quicksand-normal">{card.title}</h3>
        <p className="text-slate-600 dark:text-gray-300">{card.desc}</p>
      </div>
    ))}
  </div>
);

// 🎓 Benefit Cards
const BenefitCards = () => (
  <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-center px-4">
    {[
      {
        title: "Educators:",
        icon: faChalkboardUser,
        desc: "Quickly generate quizzes for your students and focus on what matters – teaching.",
      },
      {
        title: "Content Creators:",
        icon: faPencilRuler,
        desc: "Enhance your courses and materials with engaging quizzes without the hassle.",
      },
      {
        title: "Business Professionals:",
        icon: faBriefcase,
        desc: "Streamline training sessions by creating quizzes from your PDF presentations.",
      },
    ].map((card, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 text-slate-800 dark:text-white p-6 rounded-2xl w-full md:w-1/4 h-64 flex flex-col items-center text-center gap-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group hover:scale-101 relative"
      >
        <FontAwesomeIcon icon={card.icon} className="text-5xl mb-2 text-[#f73e00]" />
        <h3 className="text-2xl font-bold quicksand-normal">{card.title}</h3>
        <p className="text-slate-600 dark:text-gray-300">{card.desc}</p>
      </div>
    ))}
  </div>
);
