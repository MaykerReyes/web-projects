(function () {
  window.studyQuestConfig = {
    topicQuestSizes: {
      Algebra: 4,
      Functions: 4,
      Geometry: 4,
      Statistics: 3,
      "Literary Analysis": 4,
      Grammar: 4,
      Writing: 3,
      Vocabulary: 3,
      Biology: 3,
      Physics: 3,
      "Earth Science": 2,
      "Scientific Practices": 3,
      Civics: 2,
      "Modern History": 2,
      Economics: 1,
      Geography: 15,
      Chemistry: 15
    }
  };

  window.studyQuestExercises = [
    {
      id: 1,
      subject: "Math",
      topic: "Algebra",
      question: "Solve for x: 3x - 5 = 16.",
      options: ["7", "8", "6", "5"],
      correctAnswer: "7",
      explanation: "Add 5 to both sides to get 3x = 21, then divide by 3. x = 7."
    },
    {
      id: 2,
      subject: "Math",
      topic: "Algebra",
      question: "If 2(x + 4) = 18, what is x?",
      options: ["5", "4", "7", "3"],
      correctAnswer: "5",
      explanation: "Divide both sides by 2 to get x + 4 = 9, then subtract 4. x = 5."
    },
    {
      id: 3,
      subject: "Math",
      topic: "Algebra",
      question: "Solve: 5x - 2 = 3x + 8.",
      options: ["5", "6", "4", "9"],
      correctAnswer: "5",
      explanation: "Subtract 3x from both sides to get 2x - 2 = 8, then add 2 and divide by 2. x = 5."
    },
    {
      id: 4,
      subject: "Math",
      topic: "Algebra",
      question: "What is the value of x if x / 4 + 6 = 10?",
      options: ["12", "16", "8", "4"],
      correctAnswer: "16",
      explanation: "Subtract 6 from both sides to get x / 4 = 4, then multiply by 4. x = 16."
    },
    {
      id: 5,
      subject: "Math",
      topic: "Functions",
      question: "If f(x) = 2x + 3, what is f(4)?",
      options: ["8", "11", "14", "10"],
      correctAnswer: "11",
      explanation: "Replace x with 4: 2 x 4 + 3 = 8 + 3 = 11."
    },
    {
      id: 6,
      subject: "Math",
      topic: "Functions",
      question: "For y = -3x + 9, what is y when x = 2?",
      options: ["3", "6", "-3", "12"],
      correctAnswer: "3",
      explanation: "Calculate -3 x 2 + 9 = -6 + 9 = 3."
    },
    {
      id: 7,
      subject: "Math",
      topic: "Functions",
      question: "Which rule describes a function with slope 5 and y-intercept 2?",
      options: ["y = 5x + 2", "y = 2x + 5", "y = x + 2", "y = 2x - 5"],
      correctAnswer: "y = 5x + 2",
      explanation: "The slope is the number multiplied by x, and the y-intercept is the constant."
    },
    {
      id: 8,
      subject: "Math",
      topic: "Functions",
      question: "If g(x) = x squared and x = 3, what is g(x)?",
      options: ["6", "9", "3", "12"],
      correctAnswer: "9",
      explanation: "Square 3 to get 9."
    },
    {
      id: 9,
      subject: "Math",
      topic: "Geometry",
      question: "What is the slope of the line through (1, 2) and (4, 8)?",
      options: ["2", "3", "6", "1"],
      correctAnswer: "2",
      explanation: "Slope = rise / run = (8 - 2) / (4 - 1) = 6 / 3 = 2."
    },
    {
      id: 10,
      subject: "Math",
      topic: "Geometry",
      question: "What is the area of a right triangle with legs 5 and 12?",
      options: ["30", "60", "17", "35"],
      correctAnswer: "30",
      explanation: "Area = 1/2 x base x height = 0.5 x 5 x 12 = 30."
    },
    {
      id: 11,
      subject: "Math",
      topic: "Geometry",
      question: "A right triangle has legs 6 and 8. What is the hypotenuse?",
      options: ["10", "12", "14", "9.6"],
      correctAnswer: "10",
      explanation: "Use the Pythagorean theorem: 6^2 + 8^2 = 100. The square root is 10."
    },
    {
      id: 12,
      subject: "Math",
      topic: "Geometry",
      question: "A triangle has angles of 35 degrees and 55 degrees. What is the third angle?",
      options: ["80 degrees", "90 degrees", "100 degrees", "85 degrees"],
      correctAnswer: "90 degrees",
      explanation: "The angles of a triangle add to 180 degrees. 180 - 35 - 55 = 90."
    },
    {
      id: 13,
      subject: "Math",
      topic: "Statistics",
      question: "Which measure is best described by finding the average of all values?",
      options: ["Median", "Mode", "Mean", "Range"],
      correctAnswer: "Mean",
      explanation: "Mean is the average: add all values and divide by how many there are."
    },
    {
      id: 14,
      subject: "Math",
      topic: "Statistics",
      question: "The numbers 67, 73, 81, 88, 92 are arranged in order. What is the median?",
      options: ["73", "81", "88", "92"],
      correctAnswer: "81",
      explanation: "The median is the middle number in a sorted list."
    },
    {
      id: 15,
      subject: "Math",
      topic: "Statistics",
      question: "What is the range of these values: 14, 18, 12, 22, 16?",
      options: ["8", "10", "6", "12"],
      correctAnswer: "10",
      explanation: "Range = largest minus smallest = 22 - 12 = 10."
    },
    {
      id: 16,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "If a story is narrated with I and me, what point of view is used?",
      options: ["First person", "Second person", "Third person", "Objective"],
      correctAnswer: "First person",
      explanation: "Using I and me means the narrator is a character in the story, which is first-person perspective."
    },
    {
      id: 17,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "What is the theme of a story?",
      options: ["The main message", "The list of characters", "The place it happens", "The first sentence"],
      correctAnswer: "The main message",
      explanation: "A theme is the central idea or message the author wants readers to understand."
    },
    {
      id: 18,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "You notice a character acts kindly to someone in trouble. This is an example of what?",
      options: ["Character trait", "Setting", "Theme", "Plot twist"],
      correctAnswer: "Character trait",
      explanation: "A character trait describes how a character behaves or thinks."
    },
    {
      id: 19,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "How does text evidence help when answering a question about a passage?",
      options: ["It supports your idea with details", "It changes the meaning", "It makes the answer shorter", "It adds a new topic"],
      correctAnswer: "It supports your idea with details",
      explanation: "Text evidence is used to back up your answer using information from the passage."
    },
    {
      id: 20,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence has correct subject-verb agreement?",
      options: ["The team is ready.", "The team are ready.", "The teams is ready.", "The teams am ready."],
      correctAnswer: "The team is ready.",
      explanation: "A singular subject such as the team needs a singular verb, so is is correct."
    },
    {
      id: 21,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Where should you place a comma in this sentence? After dinner we went to the library.",
      options: ["After dinner, we went to the library.", "After, dinner we went to the library.", "After dinner we, went to the library.", "After dinner we went, to the library."],
      correctAnswer: "After dinner, we went to the library.",
      explanation: "A comma is used after the introductory phrase After dinner."
    },
    {
      id: 22,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence uses a pronoun correctly?",
      options: ["She gave the book to me.", "Me gave the book to she.", "Her gave the book to I.", "She gave the book to I."],
      correctAnswer: "She gave the book to me.",
      explanation: "She is the subject and me is the object of the verb gave."
    },
    {
      id: 23,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Choose the sentence with the correct word form.",
      options: ["She runs quickly.", "She runs quick.", "She quick runs.", "She quickly run."],
      correctAnswer: "She runs quickly.",
      explanation: "An adverb quickly modifies the verb runs."
    },
    {
      id: 24,
      subject: "Language Arts",
      topic: "Writing",
      question: "What should a strong topic sentence do?",
      options: ["Introduce the main idea of a paragraph", "Repeat the last sentence", "List every detail", "Ask a new question"],
      correctAnswer: "Introduce the main idea of a paragraph",
      explanation: "A topic sentence tells the reader what the paragraph will focus on."
    },
    {
      id: 25,
      subject: "Language Arts",
      topic: "Writing",
      question: "Which transition best shows cause and effect?",
      options: ["Because of this", "For example", "Next", "However"],
      correctAnswer: "Because of this",
      explanation: "Because of this connects a cause to its result."
    },
    {
      id: 26,
      subject: "Language Arts",
      topic: "Writing",
      question: "What is the main purpose of a conclusion paragraph?",
      options: ["Wrap up the main idea", "Introduce a new idea", "List the sources", "Tell a different story"],
      correctAnswer: "Wrap up the main idea",
      explanation: "A conclusion reminds the reader of the main points and closes the writing."
    },
    {
      id: 27,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "Which word is a synonym for analyze?",
      options: ["Examine", "Ignore", "Guess", "Repeat"],
      correctAnswer: "Examine",
      explanation: "To analyze is to examine something carefully."
    },
    {
      id: 28,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "What does the prefix re- mean in the word rewrite?",
      options: ["Again", "Before", "Without", "Across"],
      correctAnswer: "Again",
      explanation: "The prefix re- means to do something again."
    },
    {
      id: 29,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "What does infer mean?",
      options: ["Draw a conclusion from clues", "Repeat a phrase exactly", "Write a summary", "Ask a question"],
      correctAnswer: "Draw a conclusion from clues",
      explanation: "To infer is to use evidence and reasoning to reach a conclusion."
    },
    {
      id: 30,
      subject: "Science",
      topic: "Biology",
      question: "What molecule do cells use to store and release energy?",
      options: ["ATP", "DNA", "Glucose", "RNA"],
      correctAnswer: "ATP",
      explanation: "Cells use ATP as the main energy currency for reactions."
    },
    {
      id: 31,
      subject: "Science",
      topic: "Biology",
      question: "What is the role of DNA in a cell?",
      options: ["Store genetic information", "Provide energy", "Move nutrients", "Protect the cell"],
      correctAnswer: "Store genetic information",
      explanation: "DNA contains the instructions for building proteins and traits."
    },
    {
      id: 32,
      subject: "Science",
      topic: "Biology",
      question: "Which process produces new cells for growth and repair?",
      options: ["Mitosis", "Meiosis", "Photosynthesis", "Respiration"],
      correctAnswer: "Mitosis",
      explanation: "Mitosis divides one cell into two identical cells for growth and repair."
    },
    {
      id: 33,
      subject: "Science",
      topic: "Physics",
      question: "A car travels 20 meters in 2 seconds. What is its average speed?",
      options: ["10 m/s", "40 m/s", "2 m/s", "18 m/s"],
      correctAnswer: "10 m/s",
      explanation: "Speed = distance divided by time. 20 / 2 = 10 meters per second."
    },
    {
      id: 34,
      subject: "Science",
      topic: "Physics",
      question: "If a 3 kg object has a force of 12 N applied, what is its acceleration?",
      options: ["4 m/s^2", "0.25 m/s^2", "36 m/s^2", "9 m/s^2"],
      correctAnswer: "4 m/s^2",
      explanation: "Newton's second law is F = ma. Divide 12 by 3 to get 4."
    },
    {
      id: 35,
      subject: "Science",
      topic: "Physics",
      question: "What is the potential energy of a 2 kg object at 5 m if gravity is 10 N/kg?",
      options: ["100 J", "10 J", "20 J", "50 J"],
      correctAnswer: "100 J",
      explanation: "Potential energy = mass x gravity x height. 2 x 10 x 5 = 100 joules."
    },
    {
      id: 36,
      subject: "Science",
      topic: "Earth Science",
      question: "Which layer of Earth is mostly liquid iron and nickel?",
      options: ["Outer core", "Inner core", "Mantle", "Crust"],
      correctAnswer: "Outer core",
      explanation: "The outer core is the liquid layer beneath the mantle."
    },
    {
      id: 37,
      subject: "Science",
      topic: "Earth Science",
      question: "What causes the seasons on Earth?",
      options: ["Tilt of Earth's axis", "Distance from the sun", "Ocean currents", "Volcanoes"],
      correctAnswer: "Tilt of Earth's axis",
      explanation: "Seasons happen because Earth's axis is tilted as it orbits the sun."
    },
    {
      id: 38,
      subject: "Science",
      topic: "Scientific Practices",
      question: "What is a scientific hypothesis?",
      options: ["A testable explanation", "A final conclusion", "A random guess", "A measurement"],
      correctAnswer: "A testable explanation",
      explanation: "A hypothesis is an idea that can be tested with experiments or observations."
    },
    {
      id: 39,
      subject: "Science",
      topic: "Scientific Practices",
      question: "In a controlled experiment, how many variables should change at a time?",
      options: ["One", "Two", "Three", "All of them"],
      correctAnswer: "One",
      explanation: "Changing one variable at a time helps scientists see what causes a result."
    },
    {
      id: 40,
      subject: "Science",
      topic: "Scientific Practices",
      question: "If an experiment does not support the hypothesis, what should a scientist do?",
      options: ["Revise the hypothesis and test again", "Ignore the data", "Copy someone else", "Stop studying"],
      correctAnswer: "Revise the hypothesis and test again",
      explanation: "Scientists use unexpected results to improve their ideas and test again."
    },
    {
      id: 41,
      subject: "Social Studies",
      topic: "Civics",
      question: "Which branch of government makes laws?",
      options: ["Legislative", "Executive", "Judicial", "Administrative"],
      correctAnswer: "Legislative",
      explanation: "The legislative branch is responsible for creating laws."
    },
    {
      id: 42,
      subject: "Social Studies",
      topic: "Civics",
      question: "Which right is protected by the First Amendment?",
      options: ["Free speech", "Trial by jury", "Privacy", "Property rights"],
      correctAnswer: "Free speech",
      explanation: "The First Amendment protects freedoms such as speech and religion."
    },
    {
      id: 43,
      subject: "Social Studies",
      topic: "Modern History",
      question: "Which event began World War II in Europe?",
      options: ["Germany invaded Poland", "The Titanic sank", "The moon landing", "The French Revolution"],
      correctAnswer: "Germany invaded Poland",
      explanation: "World War II in Europe began when Germany invaded Poland in 1939."
    },
    {
      id: 44,
      subject: "Social Studies",
      topic: "Modern History",
      question: "What does democracy mean?",
      options: ["Government by the people", "Government by one ruler", "Government by the military", "Government by courts"],
      correctAnswer: "Government by the people",
      explanation: "Democracy means citizens have the power to choose leaders and make decisions."
    },
    {
      id: 45,
      subject: "Social Studies",
      topic: "Economics",
      question: "If demand increases and supply stays the same, what usually happens to price?",
      options: ["Price rises", "Price falls", "Price stays the same", "Quantity decreases"],
      correctAnswer: "Price rises",
      explanation: "Higher demand with unchanged supply typically pushes prices higher."
    },
    {
      id: 46,
      subject: "Social Studies",
      topic: "Geography",
      question: "What does a map scale show?",
      options: ["How distance on the map relates to real distance", "The height of mountains", "The weather forecast", "The best route"],
      correctAnswer: "How distance on the map relates to real distance",
      explanation: "A scale shows how map measurements correspond to actual distances."
    },
    {
      id: 47,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which feature is an example of human geography?",
      options: ["Cities", "Rivers", "Mountains", "Climate"],
      correctAnswer: "Cities",
      explanation: "Human geography studies people, places, and how humans shape the environment."
    },
    {
      id: 48,
      subject: "Math",
      topic: "Algebra",
      question: "Solve the system: x + y = 10 and x - y = 2. What is x?",
      options: ["6", "4", "8", "5"],
      correctAnswer: "6",
      explanation: "Add the two equations: 2x = 12, so x = 6. (y would be 4)."
    },
    {
      id: 49,
      subject: "Math",
      topic: "Algebra",
      question: "What are the roots of x^2 - 5x + 6 = 0?",
      options: ["x = 2, 3", "x = -2, -3", "x = 1, 6", "x = -1, -6"],
      correctAnswer: "x = 2, 3",
      explanation: "The equation factors as (x - 2)(x - 3) = 0, so the roots are 2 and 3."
    },
    {
      id: 50,
      subject: "Math",
      topic: "Functions",
      question: "Find the inverse function of f(x) = 2x - 4.",
      options: ["f^-1(x) = (x + 4) / 2", "f^-1(x) = 2x + 4", "f^-1(x) = x / 2 - 4", "f^-1(x) = x - 2"],
      correctAnswer: "f^-1(x) = (x + 4) / 2",
      explanation: "Set y = 2x - 4, swap x and y to get x = 2y - 4, then solve for y: y = (x + 4) / 2."
    },
    {
      id: 51,
      subject: "Math",
      topic: "Functions",
      question: "What is the vertex of the parabola y = (x - 3)^2 + 4?",
      options: ["(3, 4)", "(-3, 4)", "(3, -4)", "(-3, -4)"],
      correctAnswer: "(3, 4)",
      explanation: "The vertex form is y = a(x - h)^2 + k, where the vertex is (h, k). Here, h=3 and k=4."
    },
    {
      id: 52,
      subject: "Math",
      topic: "Geometry",
      question: "What is the volume of a cylinder with radius 3 and height 5? (Leave in terms of pi)",
      options: ["45 pi", "15 pi", "30 pi", "90 pi"],
      correctAnswer: "45 pi",
      explanation: "Volume = pi * r^2 * h. So pi * 3^2 * 5 = 45 pi."
    },
    {
      id: 53,
      subject: "Math",
      topic: "Geometry",
      question: "In a right triangle, if legs a=3 and b=4, what is the length of the hypotenuse c?",
      options: ["5", "7", "6", "25"],
      correctAnswer: "5",
      explanation: "Using the Pythagorean theorem: 3^2 + 4^2 = c^2, so 9 + 16 = 25. The square root of 25 is 5."
    },
    {
      id: 54,
      subject: "Math",
      topic: "Statistics",
      question: "What is the probability of rolling a sum of 7 with two standard six-sided dice?",
      options: ["1/6", "1/12", "1/36", "7/36"],
      correctAnswer: "1/6",
      explanation: "There are 6 ways to roll a 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) out of 36 total possible outcomes. 6/36 simplifies to 1/6."
    },
    {
      id: 55,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "Which of the following is an example of an oxymoron?",
      options: ["Jumbo shrimp", "As busy as a bee", "The whistling wind", "A dark and stormy night"],
      correctAnswer: "Jumbo shrimp",
      explanation: "An oxymoron combines contradictory terms. Jumbo (large) and shrimp (small) contradict each other."
    },
    {
      id: 56,
      subject: "Language Arts",
      topic: "Literary Analysis",
      question: "What part of a plot is the turning point or moment of highest tension?",
      options: ["Climax", "Exposition", "Falling action", "Resolution"],
      correctAnswer: "Climax",
      explanation: "The climax is the peak of the action and tension in a narrative."
    },
    {
      id: 57,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Identify the sentence with a dangling modifier.",
      options: ["Walking to the store, the rain started to fall.", "Walking to the store, I saw the rain.", "I walked to the store in the rain.", "The rain fell as I walked to the store."],
      correctAnswer: "Walking to the store, the rain started to fall.",
      explanation: "The phrase 'Walking to the store' incorrectly modifies 'the rain', implying the rain was walking."
    },
    {
      id: 58,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence uses the subjunctive mood correctly?",
      options: ["I suggest that he study more.", "I suggest that he studies more.", "I suggest he studying more.", "I suggest that he studied more."],
      correctAnswer: "I suggest that he study more.",
      explanation: "The subjunctive mood uses the base form of the verb ('study') to express a demand, recommendation, or wish."
    },
    {
      id: 59,
      subject: "Language Arts",
      topic: "Writing",
      question: "What is the main purpose of a thesis statement?",
      options: ["To state the central argument or claim of the essay", "To hook the reader", "To summarize the conclusion", "To provide background information"],
      correctAnswer: "To state the central argument or claim of the essay",
      explanation: "A thesis statement clearly states the essay's main point or argument."
    },
    {
      id: 60,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "What does 'ubiquitous' mean?",
      options: ["Found everywhere", "Extremely rare", "Very expensive", "Highly secretive"],
      correctAnswer: "Found everywhere",
      explanation: "Ubiquitous means present, appearing, or found everywhere."
    },
    {
      id: 61,
      subject: "Science",
      topic: "Biology",
      question: "Which organelle is often called the powerhouse of the cell?",
      options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
      correctAnswer: "Mitochondria",
      explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions."
    },
    {
      id: 62,
      subject: "Science",
      topic: "Physics",
      question: "What does Newton's First Law state?",
      options: ["An object at rest stays at rest unless acted upon by a net force.", "Force equals mass times acceleration.", "For every action, there is an equal and opposite reaction.", "Energy cannot be created or destroyed."],
      correctAnswer: "An object at rest stays at rest unless acted upon by a net force.",
      explanation: "Newton's First Law is also known as the law of inertia."
    },
    {
      id: 63,
      subject: "Science",
      topic: "Physics",
      question: "What is the standard unit of force?",
      options: ["Newton", "Joule", "Watt", "Pascal"],
      correctAnswer: "Newton",
      explanation: "The Newton (N) is the SI unit of force."
    },
    {
      id: 64,
      subject: "Science",
      topic: "Chemistry",
      question: "What is the atomic number of Carbon?",
      options: ["6", "12", "14", "8"],
      correctAnswer: "6",
      explanation: "Carbon has 6 protons, giving it an atomic number of 6."
    },
    {
      id: 65,
      subject: "Social Studies",
      topic: "Civics",
      question: "How many amendments are currently in the US Constitution?",
      options: ["27", "10", "21", "33"],
      correctAnswer: "27",
      explanation: "The US Constitution has 27 ratified amendments."
    },
    {
      id: 66,
      subject: "Social Studies",
      topic: "Modern History",
      question: "What event is generally considered to mark the end of the Cold War?",
      options: ["The fall of the Soviet Union", "The end of the Vietnam War", "The Cuban Missile Crisis", "The signing of the Treaty of Versailles"],
      correctAnswer: "The fall of the Soviet Union",
      explanation: "The dissolution of the Soviet Union in 1991 is widely seen as the end of the Cold War."
    },
    {
      id: 67,
      subject: "Social Studies",
      topic: "Economics",
      question: "What is 'opportunity cost'?",
      options: ["The value of the next best alternative given up", "The cost to manufacture a good", "The price a consumer pays", "The tax placed on an item"],
      correctAnswer: "The value of the next best alternative given up",
      explanation: "Opportunity cost represents the potential benefit lost when choosing one alternative over another."
    },
    {
      id: 68,
      subject: "Math",
      topic: "Algebra",
      question: "Simplify: (2x^3)(4x^2)",
      options: ["6x^5", "8x^5", "8x^6", "6x^6"],
      correctAnswer: "8x^5",
      explanation: "Multiply the coefficients (2 x 4 = 8) and add the exponents (3 + 2 = 5) to get 8x^5."
    },
    {
      id: 69,
      subject: "Science",
      topic: "Physics",
      question: "What type of wave is light?",
      options: ["Longitudinal", "Transverse", "Mechanical", "Compression"],
      correctAnswer: "Transverse",
      explanation: "Light is an electromagnetic wave, which is a type of transverse wave."
    },
    {
      id: 70,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "What is a synonym for 'meticulous'?",
      options: ["Careless", "Sloppy", "Careful", "Rapid"],
      correctAnswer: "Careful",
      explanation: "Meticulous means showing great attention to detail; very careful and precise."
    },
    {
      id: 71,
      subject: "Social Studies",
      topic: "Modern History",
      question: "Who was the leader of the Soviet Union during the Cuban Missile Crisis?",
      options: ["Joseph Stalin", "Vladimir Lenin", "Nikita Khrushchev", "Mikhail Gorbachev"],
      correctAnswer: "Nikita Khrushchev",
      explanation: "Nikita Khrushchev led the Soviet Union during the height of the Cold War, including the Cuban Missile Crisis."
    },
    {
      id: 72,
      subject: "Math",
      topic: "Algebra",
      question: "What are the solutions to x^2 = 49?",
      options: ["x = 7 or x = -7", "x = 7 only", "x = -7 only", "x = 0"],
      correctAnswer: "x = 7 or x = -7",
      explanation: "The square root of 49 is 7, but both 7 and -7 squared equal 49."
    },
    {
      id: 73,
      subject: "Math",
      topic: "Geometry",
      question: "Two triangles are similar. If one side in the first triangle is 6 and the matching side in the second triangle is 9, what is the scale factor from the first to second?",
      options: ["1.5", "0.67", "3", "2"],
      correctAnswer: "1.5",
      explanation: "Divide 9 by 6 to get the scale factor 1.5."
    },
    {
      id: 74,
      subject: "Science",
      topic: "Physics",
      question: "If a roller coaster car has 100 J of potential energy at the top, how much energy is available to convert to motion at the bottom (ignoring friction)?",
      options: ["100 J", "0 J", "50 J", "200 J"],
      correctAnswer: "100 J",
      explanation: "Energy is conserved, so the potential energy turns into the same amount of kinetic energy if friction is ignored."
    },
    {
      id: 75,
      subject: "Language Arts",
      topic: "Writing",
      question: "What is the best purpose of a thesis statement in an essay?",
      options: ["State the essay's main idea", "List every detail", "Add a new paragraph", "Describe a person"],
      correctAnswer: "State the essay's main idea",
      explanation: "A thesis statement tells the reader what the essay will explain or argue."
    },
    {
      id: 76,
      subject: "Social Studies",
      topic: "Economics",
      question: "If the price of oranges rises and demand stays the same, what is likely to happen?",
      options: ["Fewer people buy oranges", "More people buy oranges", "Quantity sold stays the same", "Prices fall immediately"],
      correctAnswer: "Fewer people buy oranges",
      explanation: "When price rises and demand is unchanged, fewer buyers are willing to purchase at the higher price."
    },
    {
      id: 77,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "Which word is a synonym for 'precise'?",
      options: ["Exact", "Confusing", "Large", "Slow"],
      correctAnswer: "Exact",
      explanation: "Precise means exact or very accurate."
    },
    {
      id: 78,
      subject: "Science",
      topic: "Biology",
      question: "Which organelle contains the instructions for a cell?",
      options: ["Nucleus", "Chloroplast", "Mitochondria", "Cell wall"],
      correctAnswer: "Nucleus",
      explanation: "The nucleus stores DNA, which contains the cell's genetic instructions."
    },
    {
      id: 79,
      subject: "Science",
      topic: "Chemistry",
      question: "What is the chemical symbol for gold?",
      options: ["Au", "Ag", "Go", "Gd"],
      correctAnswer: "Au",
      explanation: "Au comes from the Latin name aurum. Silver is Ag."
    },
    {
      id: 80,
      subject: "Science",
      topic: "Chemistry",
      question: "How many protons does a neutral oxygen atom have?",
      options: ["8", "16", "6", "2"],
      correctAnswer: "8",
      explanation: "Atomic number 8 means oxygen has 8 protons in its nucleus."
    },
    {
      id: 81,
      subject: "Science",
      topic: "Chemistry",
      question: "What is a molecule?",
      options: ["Two or more atoms bonded together", "A single proton", "A type of rock", "A unit of heat only"],
      correctAnswer: "Two or more atoms bonded together",
      explanation: "A molecule forms when atoms share or transfer electrons to bond."
    },
    {
      id: 82,
      subject: "Science",
      topic: "Chemistry",
      question: "Which subatomic particle has a negative charge?",
      options: ["Electron", "Proton", "Neutron", "Nucleus"],
      correctAnswer: "Electron",
      explanation: "Electrons orbit the nucleus and carry a negative charge."
    },
    {
      id: 83,
      subject: "Science",
      topic: "Chemistry",
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: "H2O",
      explanation: "Water is two hydrogen atoms bonded to one oxygen atom."
    },
    {
      id: 84,
      subject: "Science",
      topic: "Chemistry",
      question: "On the pH scale, what value is considered neutral?",
      options: ["7", "0", "14", "1"],
      correctAnswer: "7",
      explanation: "Pure water at room temperature has a pH of about 7, which is neutral."
    },
    {
      id: 85,
      subject: "Science",
      topic: "Chemistry",
      question: "Which state of matter has a definite volume but no definite shape?",
      options: ["Liquid", "Solid", "Gas", "Plasma only"],
      correctAnswer: "Liquid",
      explanation: "Liquids take the shape of their container but keep a fairly constant volume."
    },
    {
      id: 86,
      subject: "Science",
      topic: "Chemistry",
      question: "The periodic table is organized mainly by increasing what?",
      options: ["Atomic number", "Color", "Weight of the planet", "Age of the element"],
      correctAnswer: "Atomic number",
      explanation: "Rows and columns reflect atomic number and repeating chemical properties."
    },
    {
      id: 87,
      subject: "Science",
      topic: "Chemistry",
      question: "In a chemical reaction, what are the starting materials called?",
      options: ["Reactants", "Products", "Catalysts only", "Isotopes"],
      correctAnswer: "Reactants",
      explanation: "Reactants are transformed into products during a chemical reaction."
    },
    {
      id: 88,
      subject: "Science",
      topic: "Chemistry",
      question: "Which type of bond involves sharing electrons between atoms?",
      options: ["Covalent", "Ionic only", "Metallic only", "Magnetic"],
      correctAnswer: "Covalent",
      explanation: "Covalent bonds form when atoms share one or more pairs of electrons."
    },
    {
      id: 89,
      subject: "Science",
      topic: "Chemistry",
      question: "What does the law of conservation of mass state?",
      options: ["Mass is neither created nor destroyed in a closed reaction", "Mass always increases", "Mass disappears in solutions", "Mass equals energy only"],
      correctAnswer: "Mass is neither created nor destroyed in a closed reaction",
      explanation: "In a closed system, the total mass of reactants equals the total mass of products."
    },
    {
      id: 90,
      subject: "Science",
      topic: "Chemistry",
      question: "Which gas makes up most of Earth's atmosphere?",
      options: ["Nitrogen", "Oxygen", "Carbon dioxide", "Hydrogen"],
      correctAnswer: "Nitrogen",
      explanation: "About 78% of the atmosphere is nitrogen gas (N2)."
    },
    {
      id: 91,
      subject: "Science",
      topic: "Chemistry",
      question: "Table salt (sodium chloride) is best described as what?",
      options: ["An ionic compound", "A noble gas", "A mixture of metals only", "A liquid element"],
      correctAnswer: "An ionic compound",
      explanation: "NaCl forms when sodium and chlorine ions attract in a crystal lattice."
    },
    {
      id: 92,
      subject: "Science",
      topic: "Chemistry",
      question: "What happens during sublimation?",
      options: ["A solid becomes a gas without becoming a liquid", "A gas becomes a solid instantly", "A liquid freezes", "A metal rusts"],
      correctAnswer: "A solid becomes a gas without becoming a liquid",
      explanation: "Dry ice (solid CO2) sublimates directly to gas at room pressure."
    },
    {
      id: 93,
      subject: "Social Studies",
      topic: "Geography",
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: "Paris",
      explanation: "Paris is the capital and largest city of France."
    },
    {
      id: 94,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which ocean is the largest on Earth?",
      options: ["Pacific", "Atlantic", "Indian", "Arctic"],
      correctAnswer: "Pacific",
      explanation: "The Pacific Ocean covers more area than all land combined."
    },
    {
      id: 95,
      subject: "Social Studies",
      topic: "Geography",
      question: "Lines of latitude measure distance in which direction from the equator?",
      options: ["North and south", "East and west only", "Altitude only", "Ocean depth"],
      correctAnswer: "North and south",
      explanation: "Latitude runs parallel to the equator and measures north-south position."
    },
    {
      id: 96,
      subject: "Social Studies",
      topic: "Geography",
      question: "Lines of longitude meet at which two points?",
      options: ["The North and South Poles", "The equator only", "The prime meridian only", "Every capital city"],
      correctAnswer: "The North and South Poles",
      explanation: "Longitude lines converge at the poles and are farthest apart at the equator."
    },
    {
      id: 97,
      subject: "Social Studies",
      topic: "Geography",
      question: "What is population density?",
      options: ["Number of people per unit of area", "Total country wealth", "Average temperature", "Height above sea level"],
      correctAnswer: "Number of people per unit of area",
      explanation: "Density compares how many people live in a given area, such as per square mile."
    },
    {
      id: 98,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which biome receives very little rainfall each year?",
      options: ["Desert", "Tropical rainforest", "Tundra with heavy rain", "Wetland"],
      correctAnswer: "Desert",
      explanation: "Deserts are defined by low precipitation, not only by heat."
    },
    {
      id: 99,
      subject: "Social Studies",
      topic: "Geography",
      question: "What do tectonic plates moving past each other often cause?",
      options: ["Earthquakes", "Tides only", "Seasons", "Wind patterns only"],
      correctAnswer: "Earthquakes",
      explanation: "Stress builds at plate boundaries and releases as seismic waves."
    },
    {
      id: 100,
      subject: "Social Studies",
      topic: "Geography",
      question: "The equator is located at about how many degrees latitude?",
      options: ["0 degrees", "90 degrees north", "45 degrees", "180 degrees"],
      correctAnswer: "0 degrees",
      explanation: "The equator is the reference line at 0 degrees latitude."
    },
    {
      id: 101,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which river is often cited as the longest in the world?",
      options: ["Nile", "Mississippi", "Thames", "Colorado"],
      correctAnswer: "Nile",
      explanation: "The Nile River in Africa is traditionally listed as the world's longest river."
    },
    {
      id: 102,
      subject: "Social Studies",
      topic: "Geography",
      question: "What does a compass rose on a map show?",
      options: ["Directions such as north and south", "Population totals", "Mountain height only", "Ocean salinity"],
      correctAnswer: "Directions such as north and south",
      explanation: "A compass rose helps readers orient the map to cardinal directions."
    },
    {
      id: 103,
      subject: "Social Studies",
      topic: "Geography",
      question: "Why do countries use time zones?",
      options: ["To match local daylight with clock time", "To change seasons", "To measure rainfall", "To set map scale"],
      correctAnswer: "To match local daylight with clock time",
      explanation: "Time zones keep noon near the middle of daylight hours as Earth rotates."
    },
    {
      id: 104,
      subject: "Social Studies",
      topic: "Geography",
      question: "What is the rain shadow effect?",
      options: ["Dry area on the leeward side of mountains", "Extra rain on ocean coasts only", "Flooding in deserts", "Snow at the equator"],
      correctAnswer: "Dry area on the leeward side of mountains",
      explanation: "Mountains block moist air, leaving drier conditions downwind."
    },
    {
      id: 105,
      subject: "Social Studies",
      topic: "Geography",
      question: "GPS technology helps determine location using what?",
      options: ["Satellites", "Compass magnets only", "Ocean currents only", "Volcano vents"],
      correctAnswer: "Satellites",
      explanation: "GPS receivers calculate position from signals sent by satellite networks."
    }
  ];
})();
