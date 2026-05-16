(function () {
  window.mathQuestConfig = {
    topicQuestSizes: {
      Fractions: 5,
      Decimals: 5,
      Operations: 4,
      Algebra: 2,
      Geometry: 4,
      Measurement: 2,
      "Coordinate Plane": 1,
      Data: 2,
      "Word Problems": 3,
      "Number Sense": 2,
      Reading: 4,
      Grammar: 4,
      Writing: 3,
      Vocabulary: 3,
      "Life Science": 4,
      "Earth Science": 4,
      "Physical Science": 4,
      "Scientific Thinking": 3,
      "US History": 4,
      Geography: 4,
      Civics: 3
    }
  };

  window.mathExercises = [
    {
      id: 1,
      topic: "Fractions",
      question: "What is 1/4 + 2/4?",
      options: ["1/8", "3/4", "3/8", "1/2"],
      correctAnswer: "3/4",
      explanation: "The denominators are the same, so add the numerators: 1 + 2 = 3. The answer is 3/4."
    },
    {
      id: 2,
      topic: "Fractions",
      question: "What is 3/5 + 1/10?",
      options: ["4/15", "7/10", "2/5", "1/2"],
      correctAnswer: "7/10",
      explanation: "Rename 3/5 as 6/10. Then 6/10 + 1/10 = 7/10."
    },
    {
      id: 3,
      topic: "Fractions",
      question: "What is 5/6 - 1/3?",
      options: ["4/3", "2/6", "1/2", "2/3"],
      correctAnswer: "1/2",
      explanation: "Rename 1/3 as 2/6. Then 5/6 - 2/6 = 3/6, which simplifies to 1/2."
    },
    {
      id: 4,
      topic: "Fractions",
      question: "Which fraction is equivalent to 4/8?",
      options: ["1/2", "1/4", "2/8", "4/4"],
      correctAnswer: "1/2",
      explanation: "Divide the numerator and denominator by 4. The fraction 4/8 simplifies to 1/2."
    },
    {
      id: 5,
      topic: "Fractions",
      question: "What is 2 1/4 + 1 1/4?",
      options: ["3 1/2", "3 1/4", "4 1/2", "2 2/4"],
      correctAnswer: "3 1/2",
      explanation: "Add the whole numbers to get 3, and add 1/4 + 1/4 to get 2/4, which is 1/2."
    },
    {
      id: 6,
      topic: "Decimals",
      question: "If you have $5.50 and buy a notebook for $2.25, how much money is left?",
      options: ["$3.25", "$3.50", "$2.75", "$3.00"],
      correctAnswer: "$3.25",
      explanation: "Line up the decimal points and subtract: 5.50 - 2.25 = 3.25."
    },
    {
      id: 7,
      topic: "Decimals",
      question: "What is 4.8 + 1.35?",
      options: ["5.95", "6.15", "6.05", "6.35"],
      correctAnswer: "6.15",
      explanation: "Write 4.8 as 4.80, then add 4.80 + 1.35 = 6.15."
    },
    {
      id: 8,
      topic: "Decimals",
      question: "What is 7.2 divided by 10?",
      options: ["72", "0.72", "0.072", "7.02"],
      correctAnswer: "0.72",
      explanation: "Dividing by 10 moves the decimal point one place to the left: 7.2 becomes 0.72."
    },
    {
      id: 9,
      topic: "Decimals",
      question: "Round 3.46 to the nearest tenth.",
      options: ["3.4", "3.5", "3.46", "4.0"],
      correctAnswer: "3.5",
      explanation: "The hundredths digit is 6, so the tenths digit rounds up from 4 to 5."
    },
    {
      id: 10,
      topic: "Decimals",
      question: "What is 0.6 x 0.4?",
      options: ["2.4", "0.24", "0.024", "1.0"],
      correctAnswer: "0.24",
      explanation: "Multiply 6 x 4 to get 24, then place two decimal digits in the product: 0.24."
    },
    {
      id: 11,
      topic: "Operations",
      question: "What is 48 x 16?",
      options: ["648", "768", "784", "808"],
      correctAnswer: "768",
      explanation: "Break 16 into 10 + 6. Then 48 x 10 = 480 and 48 x 6 = 288. Together they make 768."
    },
    {
      id: 12,
      topic: "Operations",
      question: "What is 756 divided by 9?",
      options: ["74", "82", "84", "94"],
      correctAnswer: "84",
      explanation: "9 x 80 = 720, and 756 - 720 = 36. Since 9 x 4 = 36, the quotient is 84."
    },
    {
      id: 13,
      topic: "Operations",
      question: "Solve: 3 + 4 x 2",
      options: ["14", "11", "24", "10"],
      correctAnswer: "11",
      explanation: "Use order of operations. Multiply first: 4 x 2 = 8. Then add 3 + 8 = 11."
    },
    {
      id: 14,
      topic: "Operations",
      question: "Solve: (18 - 6) divided by 3",
      options: ["4", "6", "9", "12"],
      correctAnswer: "4",
      explanation: "Do the parentheses first: 18 - 6 = 12. Then 12 divided by 3 = 4."
    },
    {
      id: 15,
      topic: "Algebra",
      question: "If n = 7, what is 5n + 3?",
      options: ["35", "38", "45", "53"],
      correctAnswer: "38",
      explanation: "Replace n with 7. Then 5 x 7 = 35, and 35 + 3 = 38."
    },
    {
      id: 16,
      topic: "Algebra",
      question: "Which expression means four more than twice a number?",
      options: ["2n + 4", "4n + 2", "2 + 4n", "n + 4"],
      correctAnswer: "2n + 4",
      explanation: "Twice a number is 2n. Four more than that means add 4, so the expression is 2n + 4."
    },
    {
      id: 17,
      topic: "Geometry",
      question: "A rectangle is 12 cm long and 7 cm wide. What is its area?",
      options: ["19 square cm", "38 square cm", "84 square cm", "144 square cm"],
      correctAnswer: "84 square cm",
      explanation: "Area of a rectangle is length x width. So 12 x 7 = 84 square cm."
    },
    {
      id: 18,
      topic: "Geometry",
      question: "A rectangular prism is 5 units long, 4 units wide, and 3 units tall. What is its volume?",
      options: ["12 cubic units", "20 cubic units", "60 cubic units", "120 cubic units"],
      correctAnswer: "60 cubic units",
      explanation: "Volume is length x width x height. So 5 x 4 x 3 = 60 cubic units."
    },
    {
      id: 19,
      topic: "Geometry",
      question: "A square has sides that are 9 inches long. What is its perimeter?",
      options: ["18 inches", "27 inches", "36 inches", "81 inches"],
      correctAnswer: "36 inches",
      explanation: "A square has four equal sides. Add 9 four times, or multiply 9 x 4, to get 36 inches."
    },
    {
      id: 20,
      topic: "Geometry",
      question: "An angle that is less than 90 degrees is called what?",
      options: ["Right angle", "Obtuse angle", "Straight angle", "Acute angle"],
      correctAnswer: "Acute angle",
      explanation: "An acute angle measures less than 90 degrees."
    },
    {
      id: 31,
      topic: "Geometry",
      question: "A triangle has angles of 40 degrees and 60 degrees. What is the third angle?",
      options: ["60 degrees", "70 degrees", "80 degrees", "100 degrees"],
      correctAnswer: "80 degrees",
      explanation: "The angles in a triangle add to 180 degrees. 40 + 60 = 100, and 180 - 100 = 80."
    },
    {
      id: 32,
      topic: "Geometry",
      question: "Which shape has exactly one pair of parallel sides?",
      options: ["Square", "Rectangle", "Trapezoid", "Rhombus"],
      correctAnswer: "Trapezoid",
      explanation: "A trapezoid has exactly one pair of parallel sides."
    },
    {
      id: 33,
      topic: "Geometry",
      question: "A rectangle has an area of 45 square units and a length of 9 units. What is its width?",
      options: ["4 units", "5 units", "6 units", "36 units"],
      correctAnswer: "5 units",
      explanation: "Area equals length times width. Since 9 x 5 = 45, the width is 5 units."
    },
    {
      id: 34,
      topic: "Geometry",
      question: "What is the perimeter of a rectangle that is 8 inches long and 5 inches wide?",
      options: ["13 inches", "26 inches", "40 inches", "80 inches"],
      correctAnswer: "26 inches",
      explanation: "Perimeter is the distance around the shape: 8 + 5 + 8 + 5 = 26 inches."
    },
    {
      id: 35,
      topic: "Geometry",
      question: "A cube has side lengths of 4 cm. What is its volume?",
      options: ["12 cubic cm", "16 cubic cm", "48 cubic cm", "64 cubic cm"],
      correctAnswer: "64 cubic cm",
      explanation: "A cube's volume is side x side x side. So 4 x 4 x 4 = 64 cubic cm."
    },
    {
      id: 36,
      topic: "Geometry",
      question: "Which pair of lines will never meet, no matter how far they continue?",
      options: ["Parallel lines", "Intersecting lines", "Perpendicular lines", "Curved lines"],
      correctAnswer: "Parallel lines",
      explanation: "Parallel lines stay the same distance apart and never intersect."
    },
    {
      id: 37,
      topic: "Geometry",
      question: "A right angle measures how many degrees?",
      options: ["45 degrees", "90 degrees", "120 degrees", "180 degrees"],
      correctAnswer: "90 degrees",
      explanation: "A right angle always measures exactly 90 degrees."
    },
    {
      id: 38,
      topic: "Geometry",
      question: "Which shape has five sides?",
      options: ["Triangle", "Quadrilateral", "Pentagon", "Hexagon"],
      correctAnswer: "Pentagon",
      explanation: "A pentagon is a polygon with five sides."
    },
    {
      id: 21,
      topic: "Measurement",
      question: "How many feet are in 3 yards?",
      options: ["6 feet", "9 feet", "12 feet", "30 feet"],
      correctAnswer: "9 feet",
      explanation: "There are 3 feet in 1 yard. So 3 yards is 3 x 3 = 9 feet."
    },
    {
      id: 22,
      topic: "Measurement",
      question: "How many milliliters are in 2.5 liters?",
      options: ["25 mL", "250 mL", "2,500 mL", "25,000 mL"],
      correctAnswer: "2,500 mL",
      explanation: "One liter is 1,000 milliliters. So 2.5 liters is 2,500 milliliters."
    },
    {
      id: 23,
      topic: "Coordinate Plane",
      question: "From the origin, move 4 units right and 3 units up. Which point is this?",
      options: ["(3, 4)", "(4, 3)", "(-4, 3)", "(4, -3)"],
      correctAnswer: "(4, 3)",
      explanation: "The x-coordinate tells left or right, and the y-coordinate tells up or down. Right 4 and up 3 is (4, 3)."
    },
    {
      id: 24,
      topic: "Data",
      question: "What is the range of these numbers: 6, 8, 7, 4, 9?",
      options: ["3", "4", "5", "13"],
      correctAnswer: "5",
      explanation: "Range is the largest number minus the smallest number. Here, 9 - 4 = 5."
    },
    {
      id: 25,
      topic: "Data",
      question: "What is the mean of 4, 6, 8, and 10?",
      options: ["6", "7", "8", "28"],
      correctAnswer: "7",
      explanation: "Add the numbers to get 28, then divide by 4 numbers. 28 divided by 4 = 7."
    },
    {
      id: 26,
      topic: "Word Problems",
      question: "A recipe uses 3/4 cup of oats. If you double the recipe, how many cups of oats do you need?",
      options: ["1 cup", "1 1/2 cups", "2 cups", "3/8 cup"],
      correctAnswer: "1 1/2 cups",
      explanation: "Doubling means multiply by 2. Two groups of 3/4 make 6/4, which is 1 1/2."
    },
    {
      id: 27,
      topic: "Word Problems",
      question: "There are 36 students. If 2/3 of them ride the bus, how many students ride the bus?",
      options: ["12", "18", "24", "30"],
      correctAnswer: "24",
      explanation: "One third of 36 is 12. Two thirds is 12 x 2 = 24."
    },
    {
      id: 28,
      topic: "Word Problems",
      question: "A trail is 2.4 miles long. Maya walks 0.8 mile each day. How many days does it take to walk the trail?",
      options: ["2 days", "3 days", "4 days", "8 days"],
      correctAnswer: "3 days",
      explanation: "Divide 2.4 by 0.8. Since 0.8 x 3 = 2.4, it takes 3 days."
    },
    {
      id: 29,
      topic: "Number Sense",
      question: "What fraction is equal to 0.75?",
      options: ["1/4", "1/2", "3/4", "7/5"],
      correctAnswer: "3/4",
      explanation: "The decimal 0.75 means 75/100. Divide the top and bottom by 25 to get 3/4."
    },
    {
      id: 30,
      topic: "Number Sense",
      question: "What is the next number in the pattern: 5, 11, 17, 23, ...?",
      options: ["27", "28", "29", "31"],
      correctAnswer: "29",
      explanation: "Each number increases by 6. Add 6 to 23 to get 29."
    },
    {
      id: 101,
      subject: "Language Arts",
      topic: "Reading",
      question: "Read this sentence: 'The sky darkened, and Mia packed her picnic basket quickly.' What can you infer?",
      options: ["Mia is probably going swimming.", "Mia thinks rain may be coming.", "Mia forgot her lunch.", "Mia is going to school."],
      correctAnswer: "Mia thinks rain may be coming.",
      explanation: "The darkening sky is a clue that the weather may change, so Mia packs quickly before rain starts."
    },
    {
      id: 102,
      subject: "Language Arts",
      topic: "Reading",
      question: "Which choice best describes the main idea of a passage?",
      options: ["A tiny detail", "The most important message", "The longest sentence", "A character's name"],
      correctAnswer: "The most important message",
      explanation: "The main idea is what the whole passage is mostly about."
    },
    {
      id: 103,
      subject: "Language Arts",
      topic: "Reading",
      question: "In a story, the theme is usually...",
      options: ["A lesson or big idea", "The place where it happens", "A list of characters", "Only the first sentence"],
      correctAnswer: "A lesson or big idea",
      explanation: "A theme is the larger message a reader can learn from the story."
    },
    {
      id: 104,
      subject: "Language Arts",
      topic: "Reading",
      question: "Which sentence uses text evidence?",
      options: ["I just know it is true.", "The character is brave because she climbs the cliff to help her brother.", "The story is nice.", "I like the ending best."],
      correctAnswer: "The character is brave because she climbs the cliff to help her brother.",
      explanation: "Text evidence uses a detail from the passage to support an idea."
    },
    {
      id: 105,
      subject: "Language Arts",
      topic: "Reading",
      question: "If a story is told by a character using 'I' and 'me,' what point of view is it?",
      options: ["First person", "Second person", "Third person", "No point of view"],
      correctAnswer: "First person",
      explanation: "First-person point of view uses words like I, me, my, and we."
    },
    {
      id: 106,
      subject: "Language Arts",
      topic: "Reading",
      question: "What is the best meaning of 'ancient' in this sentence: 'The museum displayed ancient tools'?",
      options: ["Very old", "Very loud", "Brand new", "Hard to carry"],
      correctAnswer: "Very old",
      explanation: "Ancient means from a very long time ago."
    },
    {
      id: 107,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence has correct subject-verb agreement?",
      options: ["The dogs runs fast.", "The dog run fast.", "The dogs run fast.", "The running dogs runs."],
      correctAnswer: "The dogs run fast.",
      explanation: "A plural subject, dogs, needs the verb run."
    },
    {
      id: 108,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Choose the sentence with correct comma use.",
      options: ["After lunch we, went outside.", "After lunch, we went outside.", "After, lunch we went outside.", "After lunch we went, outside."],
      correctAnswer: "After lunch, we went outside.",
      explanation: "Use a comma after an introductory phrase like 'After lunch.'"
    },
    {
      id: 109,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which word correctly completes the sentence? 'The book belongs to Maya. It is ___ book.'",
      options: ["Maya", "Mayas", "Maya's", "Mayas'"],
      correctAnswer: "Maya's",
      explanation: "Use an apostrophe and s to show that one person owns something."
    },
    {
      id: 110,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence is complete?",
      options: ["Because the bell rang.", "Running through the hallway.", "The class opened their books.", "After the long weekend."],
      correctAnswer: "The class opened their books.",
      explanation: "A complete sentence has a subject and a predicate and expresses a complete thought."
    },
    {
      id: 111,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which pronoun best replaces 'Jordan and I' in this sentence: 'Jordan and I made a poster'?",
      options: ["We", "Us", "They", "Them"],
      correctAnswer: "We",
      explanation: "Jordan and I are the subject of the sentence, so the subject pronoun 'we' fits."
    },
    {
      id: 112,
      subject: "Language Arts",
      topic: "Grammar",
      question: "Which sentence uses quotation marks correctly?",
      options: ["Lena said, I finished the chapter.", "Lena said, \"I finished the chapter.\"", "\"Lena said, I finished the chapter.", "Lena \"said, I finished\" the chapter."],
      correctAnswer: "Lena said, \"I finished the chapter.\"",
      explanation: "Quotation marks go around the exact words a speaker says."
    },
    {
      id: 113,
      subject: "Language Arts",
      topic: "Writing",
      question: "What should a strong topic sentence do?",
      options: ["Introduce the main idea of a paragraph", "End the whole essay", "List every detail", "Ask an unrelated question"],
      correctAnswer: "Introduce the main idea of a paragraph",
      explanation: "A topic sentence tells readers what the paragraph will mostly explain."
    },
    {
      id: 114,
      subject: "Language Arts",
      topic: "Writing",
      question: "Which transition best shows cause and effect?",
      options: ["Next", "Because of this", "For example", "Across from"],
      correctAnswer: "Because of this",
      explanation: "'Because of this' connects a cause to what happens as a result."
    },
    {
      id: 115,
      subject: "Language Arts",
      topic: "Writing",
      question: "Which detail best supports the opinion 'School gardens are helpful'?",
      options: ["Some gardens have fences.", "Students can learn science by growing plants.", "Gardens are outside.", "Many schools have doors."],
      correctAnswer: "Students can learn science by growing plants.",
      explanation: "A supporting detail should give a clear reason for the opinion."
    },
    {
      id: 116,
      subject: "Language Arts",
      topic: "Writing",
      question: "Which sentence is the clearest revision?",
      options: ["The thing was really very good.", "The experiment worked well because the seed sprouted.", "It was nice and stuff.", "The good thing happened."],
      correctAnswer: "The experiment worked well because the seed sprouted.",
      explanation: "The clearest sentence uses specific words that tell exactly what happened."
    },
    {
      id: 117,
      subject: "Language Arts",
      topic: "Writing",
      question: "What is a conclusion supposed to do?",
      options: ["Introduce a brand-new topic", "Repeat every sentence", "Wrap up the main idea", "Hide the opinion"],
      correctAnswer: "Wrap up the main idea",
      explanation: "A conclusion reminds readers of the main idea and gives the writing a finished feeling."
    },
    {
      id: 118,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "Which word is a synonym for 'rapid'?",
      options: ["Fast", "Tiny", "Careful", "Quiet"],
      correctAnswer: "Fast",
      explanation: "Rapid means fast or quick."
    },
    {
      id: 119,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "Which prefix means 'not' or 'opposite of'?",
      options: ["pre-", "un-", "re-", "sub-"],
      correctAnswer: "un-",
      explanation: "The prefix un- can mean not, as in unhappy or unclear."
    },
    {
      id: 120,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "What does the suffix '-less' mean in 'fearless'?",
      options: ["Full of", "Without", "Before", "Again"],
      correctAnswer: "Without",
      explanation: "Fearless means without fear."
    },
    {
      id: 121,
      subject: "Language Arts",
      topic: "Vocabulary",
      question: "Choose the best meaning of 'predict.'",
      options: ["To explain after reading", "To make a smart guess about what will happen", "To copy exactly", "To erase a mistake"],
      correctAnswer: "To make a smart guess about what will happen",
      explanation: "Predict means to use clues to make a reasonable guess about the future."
    },
    {
      id: 201,
      subject: "Science",
      topic: "Life Science",
      question: "In a food chain, what role does a plant usually have?",
      options: ["Producer", "Consumer", "Predator", "Decomposer"],
      correctAnswer: "Producer",
      explanation: "Plants are producers because they make their own food using sunlight."
    },
    {
      id: 202,
      subject: "Science",
      topic: "Life Science",
      question: "Which animal adaptation helps a duck swim?",
      options: ["Webbed feet", "Sharp claws", "Long eyelashes", "Thick fur"],
      correctAnswer: "Webbed feet",
      explanation: "Webbed feet push against water and help ducks move while swimming."
    },
    {
      id: 203,
      subject: "Science",
      topic: "Life Science",
      question: "What do decomposers do in an ecosystem?",
      options: ["Make sunlight", "Break down dead plants and animals", "Create rocks", "Stop all food chains"],
      correctAnswer: "Break down dead plants and animals",
      explanation: "Decomposers recycle nutrients by breaking down dead matter."
    },
    {
      id: 204,
      subject: "Science",
      topic: "Life Science",
      question: "What does photosynthesis help plants make?",
      options: ["Food", "Rocks", "Metal", "Feathers"],
      correctAnswer: "Food",
      explanation: "Photosynthesis lets plants use sunlight, water, and carbon dioxide to make food."
    },
    {
      id: 205,
      subject: "Science",
      topic: "Life Science",
      question: "Which trait is inherited?",
      options: ["A scar from falling", "Eye color", "A learned song", "A favorite book"],
      correctAnswer: "Eye color",
      explanation: "Inherited traits are passed from parents to offspring, like eye color."
    },
    {
      id: 206,
      subject: "Science",
      topic: "Life Science",
      question: "Which part of a plant takes in water from the soil?",
      options: ["Roots", "Flowers", "Seeds", "Petals"],
      correctAnswer: "Roots",
      explanation: "Roots anchor the plant and absorb water and nutrients from the soil."
    },
    {
      id: 207,
      subject: "Science",
      topic: "Earth Science",
      question: "What part of the water cycle turns liquid water into water vapor?",
      options: ["Condensation", "Evaporation", "Precipitation", "Collection"],
      correctAnswer: "Evaporation",
      explanation: "Evaporation happens when liquid water changes into water vapor."
    },
    {
      id: 208,
      subject: "Science",
      topic: "Earth Science",
      question: "What causes day and night on Earth?",
      options: ["Earth's rotation", "Earth's color", "The Moon's shape", "Cloud movement"],
      correctAnswer: "Earth's rotation",
      explanation: "Earth rotates on its axis, causing different places to face toward or away from the Sun."
    },
    {
      id: 209,
      subject: "Science",
      topic: "Earth Science",
      question: "Which process moves small pieces of rock and soil from one place to another?",
      options: ["Erosion", "Freezing", "Magnetism", "Condensation"],
      correctAnswer: "Erosion",
      explanation: "Erosion moves weathered rock and soil by wind, water, ice, or gravity."
    },
    {
      id: 210,
      subject: "Science",
      topic: "Earth Science",
      question: "Which is a renewable energy source?",
      options: ["Coal", "Oil", "Solar power", "Natural gas"],
      correctAnswer: "Solar power",
      explanation: "Solar power uses sunlight, which is naturally replaced every day."
    },
    {
      id: 211,
      subject: "Science",
      topic: "Earth Science",
      question: "What is the difference between weather and climate?",
      options: ["Weather is daily conditions; climate is a long-term pattern.", "Weather and climate mean exactly the same thing.", "Climate only happens indoors.", "Weather lasts for thousands of years only."],
      correctAnswer: "Weather is daily conditions; climate is a long-term pattern.",
      explanation: "Weather can change day to day, while climate describes patterns over many years."
    },
    {
      id: 212,
      subject: "Science",
      topic: "Earth Science",
      question: "Which type of rock forms from cooled lava or magma?",
      options: ["Igneous", "Sedimentary", "Metamorphic", "Fossil"],
      correctAnswer: "Igneous",
      explanation: "Igneous rocks form when melted rock cools and hardens."
    },
    {
      id: 213,
      subject: "Science",
      topic: "Physical Science",
      question: "A push or pull is called a...",
      options: ["Force", "Shadow", "Mixture", "Planet"],
      correctAnswer: "Force",
      explanation: "A force is a push or pull that can change an object's motion."
    },
    {
      id: 214,
      subject: "Science",
      topic: "Physical Science",
      question: "Which material is usually a good conductor of electricity?",
      options: ["Rubber", "Plastic", "Copper", "Wood"],
      correctAnswer: "Copper",
      explanation: "Metals like copper let electric current move through them easily."
    },
    {
      id: 215,
      subject: "Science",
      topic: "Physical Science",
      question: "What happens when water freezes?",
      options: ["It becomes a gas.", "It becomes a solid.", "It disappears.", "It becomes metal."],
      correctAnswer: "It becomes a solid.",
      explanation: "Freezing changes liquid water into solid ice."
    },
    {
      id: 216,
      subject: "Science",
      topic: "Physical Science",
      question: "Which simple machine is a ramp?",
      options: ["Inclined plane", "Pulley", "Wheel and axle", "Lever"],
      correctAnswer: "Inclined plane",
      explanation: "A ramp is an inclined plane because it is a flat surface set at an angle."
    },
    {
      id: 217,
      subject: "Science",
      topic: "Physical Science",
      question: "What kind of energy does a moving bicycle have?",
      options: ["Kinetic energy", "Stored chemical energy only", "Soundless energy", "No energy"],
      correctAnswer: "Kinetic energy",
      explanation: "Kinetic energy is the energy of motion."
    },
    {
      id: 218,
      subject: "Science",
      topic: "Physical Science",
      question: "Which objects are most likely attracted to a magnet?",
      options: ["Iron nails", "Paper plates", "Glass cups", "Wood pencils"],
      correctAnswer: "Iron nails",
      explanation: "Magnets attract some metals, especially iron and steel."
    },
    {
      id: 219,
      subject: "Science",
      topic: "Scientific Thinking",
      question: "Why should a scientist repeat an experiment?",
      options: ["To make the data more reliable", "To use extra paper", "To change the question every time", "To avoid observing results"],
      correctAnswer: "To make the data more reliable",
      explanation: "Repeating an experiment helps show whether the results are consistent."
    },
    {
      id: 220,
      subject: "Science",
      topic: "Scientific Thinking",
      question: "In an experiment, what is a variable?",
      options: ["Something that can change", "A final answer", "A type of rock", "A notebook page"],
      correctAnswer: "Something that can change",
      explanation: "A variable is a factor that can change or be changed in an investigation."
    },
    {
      id: 221,
      subject: "Science",
      topic: "Scientific Thinking",
      question: "Which tool is best for measuring temperature?",
      options: ["Thermometer", "Ruler", "Scale", "Compass"],
      correctAnswer: "Thermometer",
      explanation: "A thermometer measures temperature."
    },
    {
      id: 222,
      subject: "Science",
      topic: "Scientific Thinking",
      question: "What is a conclusion in science?",
      options: ["A claim based on evidence", "A random guess", "The title of a chart", "A list of supplies only"],
      correctAnswer: "A claim based on evidence",
      explanation: "A scientific conclusion explains what the evidence shows."
    },
    {
      id: 301,
      subject: "Social Studies",
      topic: "US History",
      question: "Why did many American colonists protest taxes before the Revolutionary War?",
      options: ["They had no representatives in Parliament.", "They wanted colder weather.", "They disliked newspapers.", "They wanted fewer farms."],
      correctAnswer: "They had no representatives in Parliament.",
      explanation: "Many colonists believed it was unfair to be taxed without having a voice in Parliament."
    },
    {
      id: 302,
      subject: "Social Studies",
      topic: "US History",
      question: "What document begins with 'We the People'?",
      options: ["The US Constitution", "The Mayflower Compact", "The Star-Spangled Banner", "The Louisiana Purchase"],
      correctAnswer: "The US Constitution",
      explanation: "The Preamble to the US Constitution begins with the words 'We the People.'"
    },
    {
      id: 303,
      subject: "Social Studies",
      topic: "US History",
      question: "What was the Louisiana Purchase?",
      options: ["A large land purchase by the United States", "A famous court case", "A type of wagon", "A tax on tea"],
      correctAnswer: "A large land purchase by the United States",
      explanation: "The Louisiana Purchase greatly expanded the land area of the United States in 1803."
    },
    {
      id: 304,
      subject: "Social Studies",
      topic: "US History",
      question: "Which person is known for helping enslaved people escape through the Underground Railroad?",
      options: ["Harriet Tubman", "Thomas Edison", "Betsy Ross", "Neil Armstrong"],
      correctAnswer: "Harriet Tubman",
      explanation: "Harriet Tubman guided many enslaved people to freedom using the Underground Railroad."
    },
    {
      id: 305,
      subject: "Social Studies",
      topic: "US History",
      question: "What did the Declaration of Independence announce?",
      options: ["The colonies were separating from Great Britain.", "The first national park was opening.", "The US bought Alaska.", "The Civil War had ended."],
      correctAnswer: "The colonies were separating from Great Britain.",
      explanation: "The Declaration announced that the colonies considered themselves independent states."
    },
    {
      id: 306,
      subject: "Social Studies",
      topic: "US History",
      question: "What movement worked to win voting rights for women?",
      options: ["Women's suffrage", "The space race", "The gold rush", "The Lewis and Clark expedition"],
      correctAnswer: "Women's suffrage",
      explanation: "The women's suffrage movement worked for women's right to vote."
    },
    {
      id: 307,
      subject: "Social Studies",
      topic: "Geography",
      question: "What does a compass rose show on a map?",
      options: ["Directions", "Population", "Temperature", "Elevation only"],
      correctAnswer: "Directions",
      explanation: "A compass rose shows directions such as north, south, east, and west."
    },
    {
      id: 308,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which imaginary line divides Earth into Northern and Southern Hemispheres?",
      options: ["Equator", "Prime Meridian", "International Date Line", "Tropic of Cancer"],
      correctAnswer: "Equator",
      explanation: "The Equator circles Earth halfway between the North Pole and South Pole."
    },
    {
      id: 309,
      subject: "Social Studies",
      topic: "Geography",
      question: "What is a map scale used for?",
      options: ["Measuring real distance", "Showing the map title", "Coloring oceans", "Finding a book page"],
      correctAnswer: "Measuring real distance",
      explanation: "A map scale shows how distance on a map compares to distance in the real world."
    },
    {
      id: 310,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which is a physical feature?",
      options: ["Mountain", "State border", "City name", "Highway number"],
      correctAnswer: "Mountain",
      explanation: "Physical features are natural landforms or bodies of water."
    },
    {
      id: 311,
      subject: "Social Studies",
      topic: "Geography",
      question: "Which region of the United States is known for the Rocky Mountains?",
      options: ["West", "Southeast", "Northeast", "Midwest"],
      correctAnswer: "West",
      explanation: "The Rocky Mountains run through several western states."
    },
    {
      id: 312,
      subject: "Social Studies",
      topic: "Geography",
      question: "What kind of map shows borders between states and countries?",
      options: ["Political map", "Weather map", "Resource map", "Road map only"],
      correctAnswer: "Political map",
      explanation: "Political maps show human-made boundaries such as states and countries."
    },
    {
      id: 313,
      subject: "Social Studies",
      topic: "Civics",
      question: "What is one responsibility of citizens?",
      options: ["Obeying laws", "Ignoring elections", "Avoiding all taxes", "Changing the weather"],
      correctAnswer: "Obeying laws",
      explanation: "Citizens are responsible for following laws and helping their communities."
    },
    {
      id: 314,
      subject: "Social Studies",
      topic: "Civics",
      question: "Which branch of government makes laws?",
      options: ["Legislative", "Executive", "Judicial", "Weather"],
      correctAnswer: "Legislative",
      explanation: "The legislative branch, Congress, makes federal laws."
    },
    {
      id: 315,
      subject: "Social Studies",
      topic: "Civics",
      question: "What is the job of the judicial branch?",
      options: ["Interpret laws", "Command the military only", "Write every newspaper", "Build all roads"],
      correctAnswer: "Interpret laws",
      explanation: "The judicial branch includes courts that interpret laws and the Constitution."
    },
    {
      id: 316,
      subject: "Social Studies",
      topic: "Civics",
      question: "Why do communities have rules and laws?",
      options: ["To help people stay safe and fair", "To make maps larger", "To stop people from reading", "To change seasons"],
      correctAnswer: "To help people stay safe and fair",
      explanation: "Rules and laws help people understand rights, responsibilities, and safety."
    },
    {
      id: 317,
      subject: "Social Studies",
      topic: "Civics",
      question: "What is voting?",
      options: ["Choosing leaders or deciding issues", "Measuring mountains", "Writing fiction", "Planting crops"],
      correctAnswer: "Choosing leaders or deciding issues",
      explanation: "Voting is one way citizens take part in government."
    }
  ];
})();
