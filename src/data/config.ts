/**
 * BILLA UNIVERSITY — CORE CONFIGURATION & REPOSITORY DATA
 * All configurable text, image arrays, quiz questions, and background paths
 * are centralized here for easy editing and maintenance.
 */

export interface CommentItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface MemeItem {
  id: number;
  src: string;
  caption: string;
  category: 'Classroom' | 'Exams' | 'Hostel' | 'Friends';
  likes: number;
  comments?: CommentItem[];
}

export interface BrainrotItem {
  id: number;
  title: string;
  tag: string;
  src: string;
  desc: string;
}

export interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  answer: number; // 0-indexed correct answer
}

export interface BallKnowledgeItem {
  id: number;
  title: string;
  src: string;
  caption: string;
}

export const SITE_CONFIG = {
  siteName: "BILLA UNIVERSITY",
  curator: "Made by Mriganka.001",
  // Logo image
  logoImg: "/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg",
  // The client's attached image (Billa dog meme)
  backgroundImg: "/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg",
  // Toggle true for 100% monochrome grayscale background, false for natural tone
  defaultGrayscaleBackground: false,
  // Blur amount for background: tuned to 2px light blur as requested
  backgroundBlur: "2px",
};

// 12+ Curated Meme Specimen Records
export const MEMES_DATA: MemeItem[] = [
  {
    id: 1,
    src: "/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg",
    caption: "Chancellor Billa presiding over the annual convocation with zero attendance record.",
    category: "Classroom",
    likes: 3420,
  },
  {
    id: 2,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNNo2iRDfsjqngQeJ17qRSs9sO1SCTXvKM4wqNW6XPMeBaqgELKKhUD_7H3NoOBbTNELlzfVD40SRcuVuHc6Fdxu57Ct6ST4ds0mImhs23Ws1Zjazz4RvA3w733z547SIphf-_KjNMGreWMru6Uzd5VaClmH00vnmia6v0iBpP-yytjyyf3Vkqa9NEeQYz0pnPH1IeZPs-8z3HDGp4luneaW4tvjbbEiv_c5G7f35OE-Hq98BFiTh",
    caption: "Gadi lamborghini peele rang di menu kendi ay chala ve slowly.",
    category: "Classroom",
    likes: 1840,
  },
  {
    id: 3,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuVj0GCktf2RjmAj-gLM56vyapIMbwBV6qA-6bfiiU-Z9res6i6PqHcOxmmWua97JXYz6pvpaVj2ROrzIToCs62YaNOzzYxCzYrgglN8b5P2_Jj-Z0e8xgVWNnLSfHTBatubaThSF7A-Z0laa560w2YNsucdL_gTS8VO7nT7NkZxqf_mu6ieIU4lrIbSaq7O0tF_2GaAxlrfHUjE4828O6wDpDCNmqUT26Vt6Bb6qXowv96VVi5skk",
    caption: "Contractor: Pehle itna chal ke dekho... pasand aaye toh aur banwa denge.",
    category: "Exams",
    likes: 2490,
  },
  {
    id: 4,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_WvyUao5uMWdATFFVwNK3EwrVpMSa_3gVzvOLc0N1Z9W04Lx5ah9m7sX0jE3PsBeL8SWBcJr5JrV20tlPOP6HDZhL21BqgrKRQw_cpBR_tBv3Cd3KpZDxEfIZoC1BSTsJIWfHnYJEU4A80cry-fFnBe9I8sY-l9NSnC0RWZSckIRQLZcpLcGlXYLVy2NSvdlffkLsD-KcmQnHchOwBSWF3cS9s4wn2U25dIxGxm2-CPl1cP4u-Fym",
    caption: "My thumb after scrolling reels continuously for 6 hours straight.",
    category: "Hostel",
    likes: 3120,
  },
  {
    id: 5,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuABAPsfutxv79aIqtxHRFAAM4rqBtB0pB913z6smOq7K4aio-3xk4g5ckSkXL1iboZNgYRZPmQ22NrQzbigvhCAQjpixRaKwIBOOuBiULwopphGdId-9U-PduMhRp_LSBx9eXQY7tcZtvjBhqKkiZN_T1e8s4He10fxNy1yQGsA_iHIAsDuLHgorHuHET11AyLtkv86pfUjVUXVawcGKEj1WvYDLu3AfGed78BxGocy0brb1Nk4hSde",
    caption: "Fridge me chill karti hui sabjiyan vs Palang ke niche pade hue aaloo.",
    category: "Hostel",
    likes: 1980,
  },
  {
    id: 6,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAKZIDjtXdjrFyKXnPIgH7vhCAYzpQSfFn5CskvBPoYhuy1tb0J3xQFs2XSLaBk7hvxBjIQrL9LSdt1HwCxYqX5_n1ITNtbrfCj5PZ4g5Df4WKvqPCkmvXPWvNaw68aID7VDykwXE9_HjQSc_13p3q4mkpAOTrmZ_R1U44hFa9ycV5qc0CX-6a5AQD8Ybs-8LzK0ybPKn9N9juT5r_SBj9uGfxdL0Lqw6jICao2w_wqCcQieiRLSyjt",
    caption: "Disclaimer: This video is not made for kids except Balraj Singh bhai's kids.",
    category: "Friends",
    likes: 2150,
  },
  {
    id: 7,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10erwB3hH7KDpkO6u9BH3tTElVrpvrXXp4F_RKfhLZM9kKur2tf2UDcluF6--U4b1X1jrA-FnLBDDZ_YP_-2QlPNcnYMox_IfMUEyaEx3HVn-bK_Kerib4_S7KKUnZ2Yy27m3qvPdGLf8Z4-pHm8c29hB6iQPD0EcYbO-HqxEiIu4IAhcwT_1jTvdiMvoN78guOYPNjHbkCE_SmO6NheeRHLgPE7rrapK6F7mbGLyJnU0RLgfN_Fx",
    caption: "Uncle namak hai? Colgate hai? Toh usme se thoda sa de do.",
    category: "Friends",
    likes: 3880,
  },
  {
    id: 8,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD378aPF068mjTznWw7hHjcXtoZNvTOXm5fQ5uqHMDhz1eZiPCcrNo5NcjNSM7EJ6Bra12qkX12F15ZifS81TGPClC0GzQnxDSAbfZ9a7CaZV7tsLyxCRurOmPoCZC9fQhIJxL0Fcyu6d5R_YZuMlTGDmVSzo_lLbgDebdDCYHB9OjHVOZ49cEN0so23ilIOrSCK5ZEi2bTVrjfboB8t_xGTNnNQJOxM-tAWQhmVcT5dwhfYLGNZtQ7",
    caption: "Smug Chancellor Billa analyzing your GPA after 100 days of skipping lectures.",
    category: "Classroom",
    likes: 4920,
  },
  {
    id: 9,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_WvyUao5uMWdATFFVwNK3EwrVpMSa_3gVzvOLc0N1Z9W04Lx5ah9m7sX0jE3PsBeL8SWBcJr5JrV20tlPOP6HDZhL21BqgrKRQw_cpBR_tBv3Cd3KpZDxEfIZoC1BSTsJIWfHnYJEU4A80cry-fFnBe9I8sY-l9NSnC0RWZSckIRQLZcpLcGlXYLVy2NSvdlffkLsD-KcmQnHchOwBSWF3cS9s4wn2U25dIxGxm2-CPl1cP4u-Fym",
    caption: "Post-scroll digital fatigue protocol: trying to remember who won the 2011 world cup.",
    category: "Exams",
    likes: 1205,
  },
  {
    id: 10,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuVj0GCktf2RjmAj-gLM56vyapIMbwBV6qA-6bfiiU-Z9res6i6PqHcOxmmWua97JXYz6pvpaVj2ROrzIToCs62YaNOzzYxCzYrgglN8b5P2_Jj-Z0e8xgVWNnLSfHTBatubaThSF7A-Z0laa560w2YNsucdL_gTS8VO7nT7NkZxqf_mu6ieIU4lrIbSaq7O0tF_2GaAxlrfHUjE4828O6wDpDCNmqUT26Vt6Bb6qXowv96VVi5skk",
    caption: "Civil engineering viva defense: demo test segment evaluated and cleared.",
    category: "Exams",
    likes: 2750,
  },
  {
    id: 11,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10erwB3hH7KDpkO6u9BH3tTElVrpvrXXp4F_RKfhLZM9kKur2tf2UDcluF6--U4b1X1jrA-FnLBDDZ_YP_-2QlPNcnYMox_IfMUEyaEx3HVn-bK_Kerib4_S7KKUnZ2Yy27m3qvPdGLf8Z4-pHm8c29hB6iQPD0EcYbO-HqxEiIu4IAhcwT_1jTvdiMvoN78guOYPNjHbkCE_SmO6NheeRHLgPE7rrapK6F7mbGLyJnU0RLgfN_Fx",
    caption: "Hostel midnight trade negotiations: borrowing 20ml of shampoo for a lifetime.",
    category: "Hostel",
    likes: 1670,
  },
  {
    id: 12,
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBmNNo2iRDfsjqngQeJ17qRSs9sO1SCTXvKM4wqNW6XPMeBaqgELKKhUD_7H3NoOBbTNELlzfVD40SRcuVuHc6Fdxu57Ct6ST4ds0mImhs23Ws1Zjazz4RvA3w733z547SIphf-_KjNMGreWMru6Uzd5VaClmH00vnmia6v0iBpP-yytjyyf3Vkqa9NEeQYz0pnPH1IeZPs-8z3HDGp4luneaW4tvjbbEiv_c5G7f35OE-Hq98BFiTh",
    caption: "The final lap around campus before submission deadline at 11:59 PM.",
    category: "Friends",
    likes: 5410,
  },
];

// BRAINROT DATASET
export const BRAINROT_DATA: BrainrotItem[] = [
  {
    id: 1,
    title: "DIGITAL THUMB HYPERTROPHY",
    tag: "SKIBIDI 100",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_WvyUao5uMWdATFFVwNK3EwrVpMSa_3gVzvOLc0N1Z9W04Lx5ah9m7sX0jE3PsBeL8SWBcJr5JrV20tlPOP6HDZhL21BqgrKRQw_cpBR_tBv3Cd3KpZDxEfIZoC1BSTsJIWfHnYJEU4A80cry-fFnBe9I8sY-l9NSnC0RWZSckIRQLZcpLcGlXYLVy2NSvdlffkLsD-KcmQnHchOwBSWF3cS9s4wn2U25dIxGxm2-CPl1cP4u-Fym",
    desc: "Thumb elongation after 14 consecutive hours of infinite scroll dopamine loops.",
  },
  {
    id: 2,
    title: "10-METER DEMO RUNWAY",
    tag: "NPC BEHAVIOR",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuVj0GCktf2RjmAj-gLM56vyapIMbwBV6qA-6bfiiU-Z9res6i6PqHcOxmmWua97JXYz6pvpaVj2ROrzIToCs62YaNOzzYxCzYrgglN8b5P2_Jj-Z0e8xgVWNnLSfHTBatubaThSF7A-Z0laa560w2YNsucdL_gTS8VO7nT7NkZxqf_mu6ieIU4lrIbSaq7O0tF_2GaAxlrfHUjE4828O6wDpDCNmqUT26Vt6Bb6qXowv96VVi5skk",
    desc: "Contractor constructed 10 meters of paved road to test friction coefficients.",
  },
  {
    id: 3,
    title: "SUBTERRANEAN AALOO SEQUESTRATION",
    tag: "SUB-ZERO AURA",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuABAPsfutxv79aIqtxHRFAAM4rqBtB0pB913z6smOq7K4aio-3xk4g5ckSkXL1iboZNgYRZPmQ22NrQzbigvhCAQjpixRaKwIBOOuBiULwopphGdId-9U-PduMhRp_LSBx9eXQY7tcZtvjBhqKkiZN_T1e8s4He10fxNy1yQGsA_iHIAsDuLHgorHuHET11AyLtkv86pfUjVUXVawcGKEj1WvYDLu3AfGed78BxGocy0brb1Nk4hSde",
    desc: "Dormitory root vegetables maturing beneath spring mattresses since midterms.",
  },
  {
    id: 4,
    title: "CHANCELLOR BILLA DISDAIN",
    tag: "SIGMA PROTOCOL",
    src: "/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg",
    desc: "Maintaining an absolute smug gaze while observing mortal academic struggles.",
  },
  {
    id: 5,
    title: "COLLOIDAL TOOTHPASTE INQUIRY",
    tag: "RIZZ NEGOTIATION",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10erwB3hH7KDpkO6u9BH3tTElVrpvrXXp4F_RKfhLZM9kKur2tf2UDcluF6--U4b1X1jrA-FnLBDDZ_YP_-2QlPNcnYMox_IfMUEyaEx3HVn-bK_Kerib4_S7KKUnZ2Yy27m3qvPdGLf8Z4-pHm8c29hB6iQPD0EcYbO-HqxEiIu4IAhcwT_1jTvdiMvoN78guOYPNjHbkCE_SmO6NheeRHLgPE7rrapK6F7mbGLyJnU0RLgfN_Fx",
    desc: "Direct extraction of sodium compounds from brand-name oral hygiene inventory.",
  },
];

// ELITE BALL KNOWLEDGE 10-QUESTION QUIZ
export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    q: "Who scored the winning penalty for Chelsea in the 2012 UEFA Champions League final?",
    options: ["Frank Lampard", "Didier Drogba", "Fernando Torres", "Ashley Cole"],
    answer: 1,
  },
  {
    id: 2,
    q: "Which bowler took all 10 wickets in a single Test innings for India against Pakistan at Feroz Shah Kotla?",
    options: ["Kapil Dev", "Anil Kumble", "Harbhajan Singh", "Javagal Srinath"],
    answer: 1,
  },
  {
    id: 3,
    q: "Which club was Zinedine Zidane playing for immediately before his world-record transfer to Real Madrid in 2001?",
    options: ["Juventus", "Bordeaux", "Marseille", "AC Milan"],
    answer: 0,
  },
  {
    id: 4,
    q: "Who holds the record for the highest individual score in Men's ODI cricket history (264 runs)?",
    options: ["Virender Sehwag", "Martin Guptill", "Rohit Sharma", "Chris Gayle"],
    answer: 2,
  },
  {
    id: 5,
    q: "In what season did Arsenal complete their famous 'Invincibles' Premier League campaign without losing a single game?",
    options: ["2001-02", "2002-03", "2003-04", "2004-05"],
    answer: 2,
  },
  {
    id: 6,
    q: "Which nation won the inaugural ICC Men's T20 World Cup in Johannesburg in 2007?",
    options: ["Pakistan", "India", "Australia", "West Indies"],
    answer: 1,
  },
  {
    id: 7,
    q: "Which manager famously coined the football phrase 'Park the Bus' in 2004 against Tottenham?",
    options: ["Alex Ferguson", "Pep Guardiola", "José Mourinho", "Arsène Wenger"],
    answer: 2,
  },
  {
    id: 8,
    q: "Who delivered the iconic 'Ball of the Century' to dismiss Mike Gatting at Old Trafford in 1993?",
    options: ["Shane Warne", "Muttiah Muralitharan", "Glenn McGrath", "Wasim Akram"],
    answer: 0,
  },
  {
    id: 9,
    q: "Lionel Messi is famed for the #10 jersey, but what number did he wear upon making his official first-team debut for FC Barcelona?",
    options: ["#30", "#19", "#14", "#7"],
    answer: 0,
  },
  {
    id: 10,
    q: "Which batsman holds the world record for smashing 6 consecutive sixes in an over during the 2007 T20 World Cup?",
    options: ["Chris Gayle", "Yuvraj Singh", "Kieron Pollard", "Herschelle Gibbs"],
    answer: 1,
  },
];

// BALL KNOWLEDGE SHOWCASE
export const BALLKNOWLEDGE_DATA: BallKnowledgeItem[] = [
  {
    id: 1,
    title: "TACTICAL MASTERCLASS",
    src: "/assets/aistudio/IMG_20261104_150301_747_32ecd421.jpg",
    caption: "Billa tactical chalkboard: inverted wing-backs with zero defensive awareness.",
  },
  {
    id: 2,
    title: "THE UNPAVED PITCH",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuVj0GCktf2RjmAj-gLM56vyapIMbwBV6qA-6bfiiU-Z9res6i6PqHcOxmmWua97JXYz6pvpaVj2ROrzIToCs62YaNOzzYxCzYrgglN8b5P2_Jj-Z0e8xgVWNnLSfHTBatubaThSF7A-Z0laa560w2YNsucdL_gTS8VO7nT7NkZxqf_mu6ieIU4lrIbSaq7O0tF_2GaAxlrfHUjE4828O6wDpDCNmqUT26Vt6Bb6qXowv96VVi5skk",
    caption: "Match referee inspecting a 10m strip of tarmac for the upcoming cricket derby.",
  },
  {
    id: 3,
    title: "11:29 AM WILDCARD",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_WvyUao5uMWdATFFVwNK3EwrVpMSa_3gVzvOLc0N1Z9W04Lx5ah9m7sX0jE3PsBeL8SWBcJr5JrV20tlPOP6HDZhL21BqgrKRQw_cpBR_tBv3Cd3KpZDxEfIZoC1BSTsJIWfHnYJEU4A80cry-fFnBe9I8sY-l9NSnC0RWZSckIRQLZcpLcGlXYLVy2NSvdlffkLsD-KcmQnHchOwBSWF3cS9s4wn2U25dIxGxm2-CPl1cP4u-Fym",
    caption: "Fantasy Premier League manager activating triple captain one minute before deadline.",
  },
  {
    id: 4,
    title: "CANTEEN HYDRATION PROTOCOL",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB10erwB3hH7KDpkO6u9BH3tTElVrpvrXXp4F_RKfhLZM9kKur2tf2UDcluF6--U4b1X1jrA-FnLBDDZ_YP_-2QlPNcnYMox_IfMUEyaEx3HVn-bK_Kerib4_S7KKUnZ2Yy27m3qvPdGLf8Z4-pHm8c29hB6iQPD0EcYbO-HqxEiIu4IAhcwT_1jTvdiMvoN78guOYPNjHbkCE_SmO6NheeRHLgPE7rrapK6F7mbGLyJnU0RLgfN_Fx",
    caption: "Local water boy delivering electrolyte compounds at the 35th over drinks break.",
  },
];
