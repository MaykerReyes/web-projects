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
      Geography: 2
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
    }
  ];
})();
