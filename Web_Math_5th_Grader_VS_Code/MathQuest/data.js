// data.js
const mathExercises = [
    // FRACTIONS (15 questions)
    {
        id: 1,
        topic: "Fractions",
        question: "What is 1/4 + 2/4?",
        options: ["1/8", "3/4", "3/8", "1/2"],
        correctAnswer: "3/4",
        explanation: "When adding fractions with the same denominator, add the numerators: 1 + 2 = 3. Answer: 3/4."
    },
    {
        id: 2,
        topic: "Fractions",
        question: "What is 3/5 + 1/5?",
        options: ["4/5", "4/10", "3/5", "2/5"],
        correctAnswer: "4/5",
        explanation: "Same denominator: 3 + 1 = 4. Answer: 4/5."
    },
    {
        id: 3,
        topic: "Fractions",
        question: "What is 5/6 - 2/6?",
        options: ["3/6", "7/6", "3/12", "1/2"],
        correctAnswer: "3/6",
        explanation: "Subtract numerators: 5 - 2 = 3. Answer: 3/6 (which equals 1/2)."
    },
    {
        id: 4,
        topic: "Fractions",
        question: "What is 1/2 of 8?",
        options: ["2", "4", "6", "16"],
        correctAnswer: "4",
        explanation: "1/2 means divide by 2: 8 ÷ 2 = 4."
    },
    {
        id: 5,
        topic: "Fractions",
        question: "Which fraction is largest?",
        options: ["1/8", "1/4", "1/3", "1/6"],
        correctAnswer: "1/3",
        explanation: "The smaller the bottom number, the bigger each piece is. 1/3 is the largest."
    },
    {
        id: 6,
        topic: "Fractions",
        question: "What is 2/3 of 9?",
        options: ["3", "6", "12", "18"],
        correctAnswer: "6",
        explanation: "2/3 of 9 = (2 × 9) ÷ 3 = 18 ÷ 3 = 6."
    },
    {
        id: 7,
        topic: "Fractions",
        question: "What is 1/3 + 1/3?",
        options: ["1/6", "2/6", "2/3", "1/3"],
        correctAnswer: "2/3",
        explanation: "Same denominator: 1 + 1 = 2. Answer: 2/3."
    },
    {
        id: 8,
        topic: "Fractions",
        question: "Which is equivalent to 1/2?",
        options: ["2/3", "2/4", "3/4", "1/4"],
        correctAnswer: "2/4",
        explanation: "1/2 = 2/4 = 3/6 = 4/8... Multiply top and bottom by the same number!"
    },
    {
        id: 9,
        topic: "Fractions",
        question: "What is 3/4 - 1/4?",
        options: ["2/4", "2/8", "4/4", "1/2"],
        correctAnswer: "2/4",
        explanation: "Subtract numerators: 3 - 1 = 2. Answer: 2/4 (or 1/2)."
    },
    {
        id: 10,
        topic: "Fractions",
        question: "What is 1/5 + 2/5 + 1/5?",
        options: ["4/5", "4/15", "3/5", "4/10"],
        correctAnswer: "4/5",
        explanation: "Add numerators: 1 + 2 + 1 = 4. Answer: 4/5."
    },
    {
        id: 11,
        topic: "Fractions",
        question: "What fraction of an hour is 15 minutes?",
        options: ["1/4", "1/3", "1/2", "1/6"],
        correctAnswer: "1/4",
        explanation: "60 ÷ 15 = 4. So 15 minutes is 1/4 of an hour."
    },
    {
        id: 12,
        topic: "Fractions",
        question: "What is 2/5 + 2/5?",
        options: ["4/5", "4/10", "2/5", "1/5"],
        correctAnswer: "4/5",
        explanation: "Add numerators: 2 + 2 = 4. Answer: 4/5."
    },
    {
        id: 13,
        topic: "Fractions",
        question: "Is 3/6 equal to 1/2?",
        options: ["Yes", "No", "Maybe", "Can't tell"],
        correctAnswer: "Yes",
        explanation: "3/6 simplifies to 1/2 when you divide both by 3."
    },
    {
        id: 14,
        topic: "Fractions",
        question: "What is 1/4 of 12?",
        options: ["2", "3", "4", "6"],
        correctAnswer: "3",
        explanation: "1/4 of 12 = 12 ÷ 4 = 3."
    },
    {
        id: 15,
        topic: "Fractions",
        question: "What is 3/8 + 2/8?",
        options: ["5/8", "5/16", "1/8", "6/8"],
        correctAnswer: "5/8",
        explanation: "Add numerators: 3 + 2 = 5. Answer: 5/8."
    },

    // DECIMALS (15 questions)
    {
        id: 16,
        topic: "Decimals",
        question: "If you have $5.50 and buy something for $2.25, how much left?",
        options: ["$3.25", "$3.50", "$2.75", "$3.00"],
        correctAnswer: "$3.25",
        explanation: "5.50 - 2.25 = 3.25."
    },
    {
        id: 17,
        topic: "Decimals",
        question: "What is 2.5 + 3.2?",
        options: ["5.7", "5.2", "6.7", "5.5"],
        correctAnswer: "5.7",
        explanation: "2.5 + 3.2 = 5.7. Line up the decimals!"
    },
    {
        id: 18,
        topic: "Decimals",
        question: "What is 4.8 - 1.3?",
        options: ["3.5", "3.4", "3.6", "4.5"],
        correctAnswer: "3.5",
        explanation: "4.8 - 1.3 = 3.5."
    },
    {
        id: 19,
        topic: "Decimals",
        question: "What is 1.5 × 2?",
        options: ["3", "3.5", "2.5", "4"],
        correctAnswer: "3",
        explanation: "1.5 × 2 = 3.0."
    },
    {
        id: 20,
        topic: "Decimals",
        question: "What is 6.4 ÷ 2?",
        options: ["3.2", "3.4", "2.4", "4.2"],
        correctAnswer: "3.2",
        explanation: "6.4 ÷ 2 = 3.2."
    },
    {
        id: 21,
        topic: "Decimals",
        question: "Which is largest: 0.5, 0.05, 0.55?",
        options: ["0.5", "0.05", "0.55", "They're equal"],
        correctAnswer: "0.55",
        explanation: "0.55 is bigger than 0.5 and way bigger than 0.05."
    },
    {
        id: 22,
        topic: "Decimals",
        question: "What is 3.1 + 2.9?",
        options: ["6", "5.9", "6.1", "5"],
        correctAnswer: "6",
        explanation: "3.1 + 2.9 = 6.0."
    },
    {
        id: 23,
        topic: "Decimals",
        question: "What is 5.25 + 1.75?",
        options: ["7", "6.5", "7.25", "6"],
        correctAnswer: "7",
        explanation: "5.25 + 1.75 = 7.00."
    },
    {
        id: 24,
        topic: "Decimals",
        question: "What is 2.0 - 0.5?",
        options: ["1.5", "1.0", "2.5", "0.5"],
        correctAnswer: "1.5",
        explanation: "2.0 - 0.5 = 1.5."
    },
    {
        id: 25,
        topic: "Decimals",
        question: "What is 3.6 ÷ 3?",
        options: ["1.2", "1.3", "0.12", "12"],
        correctAnswer: "1.2",
        explanation: "3.6 ÷ 3 = 1.2."
    },
    {
        id: 26,
        topic: "Decimals",
        question: "What is 0.5 × 4?",
        options: ["2", "2.5", "3", "4"],
        correctAnswer: "2",
        explanation: "0.5 × 4 = 2.0."
    },
    {
        id: 27,
        topic: "Decimals",
        question: "What is 4.2 + 3.8?",
        options: ["8", "7.8", "8.2", "7"],
        correctAnswer: "8",
        explanation: "4.2 + 3.8 = 8.0."
    },
    {
        id: 28,
        topic: "Decimals",
        question: "Which is smallest: 0.7, 0.07, 0.77?",
        options: ["0.7", "0.07", "0.77", "They're equal"],
        correctAnswer: "0.07",
        explanation: "0.07 is one hundredth, much smaller than the others."
    },
    {
        id: 29,
        topic: "Decimals",
        question: "What is 9.5 - 4.5?",
        options: ["5", "5.5", "4.5", "6"],
        correctAnswer: "5",
        explanation: "9.5 - 4.5 = 5.0."
    },
    {
        id: 30,
        topic: "Decimals",
        question: "What is 1.25 × 4?",
        options: ["5", "4.25", "5.25", "6"],
        correctAnswer: "5",
        explanation: "1.25 × 4 = 5.00."
    },

    // ORDER OF OPERATIONS (10 questions)
    {
        id: 31,
        topic: "Order of Operations",
        question: "Solve: 3 + 4 × 2",
        options: ["14", "11", "24", "10"],
        correctAnswer: "11",
        explanation: "Multiply first: 4 × 2 = 8. Then add: 3 + 8 = 11."
    },
    {
        id: 32,
        topic: "Order of Operations",
        question: "Solve: 10 - 2 × 3",
        options: ["24", "4", "14", "6"],
        correctAnswer: "4",
        explanation: "Multiply first: 2 × 3 = 6. Then subtract: 10 - 6 = 4."
    },
    {
        id: 33,
        topic: "Order of Operations",
        question: "Solve: (5 + 3) × 2",
        options: ["11", "16", "8", "13"],
        correctAnswer: "16",
        explanation: "Parentheses first: 5 + 3 = 8. Then multiply: 8 × 2 = 16."
    },
    {
        id: 34,
        topic: "Order of Operations",
        question: "Solve: 20 ÷ 4 + 3",
        options: ["5", "8", "23", "2.75"],
        correctAnswer: "8",
        explanation: "Divide first: 20 ÷ 4 = 5. Then add: 5 + 3 = 8."
    },
    {
        id: 35,
        topic: "Order of Operations",
        question: "Solve: 2 × 3 + 4",
        options: ["14", "10", "18", "20"],
        correctAnswer: "10",
        explanation: "Multiply first: 2 × 3 = 6. Then add: 6 + 4 = 10."
    },
    {
        id: 36,
        topic: "Order of Operations",
        question: "Solve: 12 - 6 ÷ 2",
        options: ["3", "9", "6", "15"],
        correctAnswer: "9",
        explanation: "Divide first: 6 ÷ 2 = 3. Then subtract: 12 - 3 = 9."
    },
    {
        id: 37,
        topic: "Order of Operations",
        question: "Solve: 5 + 2 × 4 - 1",
        options: ["28", "12", "19", "27"],
        correctAnswer: "12",
        explanation: "Multiply: 2 × 4 = 8. Then left to right: 5 + 8 - 1 = 12."
    },
    {
        id: 38,
        topic: "Order of Operations",
        question: "Solve: (10 - 4) × 3",
        options: ["18", "22", "30", "9"],
        correctAnswer: "18",
        explanation: "Parentheses first: 10 - 4 = 6. Then multiply: 6 × 3 = 18."
    },
    {
        id: 39,
        topic: "Order of Operations",
        question: "Solve: 15 ÷ 3 × 2",
        options: ["2.5", "10", "30", "45"],
        correctAnswer: "10",
        explanation: "Left to right: 15 ÷ 3 = 5. Then: 5 × 2 = 10."
    },
    {
        id: 40,
        topic: "Order of Operations",
        question: "Solve: 8 + 4 ÷ 2 - 1",
        options: ["9", "6", "5", "13"],
        correctAnswer: "9",
        explanation: "Divide first: 4 ÷ 2 = 2. Then: 8 + 2 - 1 = 9."
    },

    // MULTIPLICATION & DIVISION (15 questions)
    {
        id: 41,
        topic: "Multiplication",
        question: "What is 7 × 8?",
        options: ["54", "56", "64", "48"],
        correctAnswer: "56",
        explanation: "7 × 8 = 56. A great fact to memorize!"
    },
    {
        id: 42,
        topic: "Multiplication",
        question: "What is 12 × 5?",
        options: ["60", "50", "70", "17"],
        correctAnswer: "60",
        explanation: "12 × 5 = 60."
    },
    {
        id: 43,
        topic: "Multiplication",
        question: "What is 9 × 6?",
        options: ["45", "54", "63", "48"],
        correctAnswer: "54",
        explanation: "9 × 6 = 54."
    },
    {
        id: 44,
        topic: "Division",
        question: "What is 56 ÷ 7?",
        options: ["8", "7", "9", "6"],
        correctAnswer: "8",
        explanation: "56 ÷ 7 = 8. (Check: 7 × 8 = 56.)"
    },
    {
        id: 45,
        topic: "Division",
        question: "What is 72 ÷ 9?",
        options: ["8", "9", "10", "7"],
        correctAnswer: "8",
        explanation: "72 ÷ 9 = 8."
    },
    {
        id: 46,
        topic: "Multiplication",
        question: "What is 11 × 7?",
        options: ["77", "88", "66", "55"],
        correctAnswer: "77",
        explanation: "11 × 7 = 77."
    },
    {
        id: 47,
        topic: "Division",
        question: "What is 63 ÷ 7?",
        options: ["8", "9", "11", "7"],
        correctAnswer: "9",
        explanation: "63 ÷ 7 = 9."
    },
    {
        id: 48,
        topic: "Multiplication",
        question: "What is 13 × 4?",
        options: ["52", "48", "56", "45"],
        correctAnswer: "52",
        explanation: "13 × 4 = 52."
    },
    {
        id: 49,
        topic: "Division",
        question: "What is 144 ÷ 12?",
        options: ["10", "11", "12", "13"],
        correctAnswer: "12",
        explanation: "144 ÷ 12 = 12."
    },
    {
        id: 50,
        topic: "Multiplication",
        question: "What is 15 × 3?",
        options: ["45", "40", "50", "48"],
        correctAnswer: "45",
        explanation: "15 × 3 = 45."
    },
    {
        id: 51,
        topic: "Division",
        question: "What is 100 ÷ 5?",
        options: ["20", "25", "15", "30"],
        correctAnswer: "20",
        explanation: "100 ÷ 5 = 20."
    },
    {
        id: 52,
        topic: "Multiplication",
        question: "What is 25 × 4?",
        options: ["100", "90", "110", "80"],
        correctAnswer: "100",
        explanation: "25 × 4 = 100."
    },
    {
        id: 53,
        topic: "Division",
        question: "What is 84 ÷ 7?",
        options: ["11", "12", "10", "14"],
        correctAnswer: "12",
        explanation: "84 ÷ 7 = 12."
    },
    {
        id: 54,
        topic: "Multiplication",
        question: "What is 20 × 6?",
        options: ["120", "100", "140", "110"],
        correctAnswer: "120",
        explanation: "20 × 6 = 120."
    },
    {
        id: 55,
        topic: "Division",
        question: "What is 96 ÷ 8?",
        options: ["11", "12", "13", "10"],
        correctAnswer: "12",
        explanation: "96 ÷ 8 = 12."
    },

    // GEOMETRY (15 questions)
    {
        id: 56,
        topic: "Geometry",
        question: "How many sides does a pentagon have?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
        explanation: "Pentagon = 5 sides. 'Penta' means five!"
    },
    {
        id: 57,
        topic: "Geometry",
        question: "What is the area of a rectangle that is 5 wide and 4 tall?",
        options: ["18", "9", "20", "22"],
        correctAnswer: "20",
        explanation: "Area = length × width = 5 × 4 = 20 square units."
    },
    {
        id: 58,
        topic: "Geometry",
        question: "How many vertices (corners) does a cube have?",
        options: ["6", "8", "10", "12"],
        correctAnswer: "8",
        explanation: "A cube has 8 corners (vertices)."
    },
    {
        id: 59,
        topic: "Geometry",
        question: "What is the perimeter of a square with sides of 6 cm?",
        options: ["12 cm", "24 cm", "36 cm", "18 cm"],
        correctAnswer: "24 cm",
        explanation: "Perimeter = 4 × side = 4 × 6 = 24 cm."
    },
    {
        id: 60,
        topic: "Geometry",
        question: "How many sides does a hexagon have?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
        explanation: "Hexagon = 6 sides. 'Hexa' means six!"
    },
    {
        id: 61,
        topic: "Geometry",
        question: "What is the area of a square with sides of 7?",
        options: ["14", "49", "28", "35"],
        correctAnswer: "49",
        explanation: "Area = side × side = 7 × 7 = 49 square units."
    },
    {
        id: 62,
        topic: "Geometry",
        question: "How many degrees are in a right angle?",
        options: ["90", "180", "45", "360"],
        correctAnswer: "90",
        explanation: "A right angle is 90 degrees (like a corner of a square)."
    },
    {
        id: 63,
        topic: "Geometry",
        question: "What is the perimeter of a rectangle 8 long and 3 wide?",
        options: ["22", "24", "11", "26"],
        correctAnswer: "22",
        explanation: "Perimeter = 2(length + width) = 2(8 + 3) = 2(11) = 22."
    },
    {
        id: 64,
        topic: "Geometry",
        question: "How many faces does a cube have?",
        options: ["4", "6", "8", "12"],
        correctAnswer: "6",
        explanation: "A cube has 6 square faces."
    },
    {
        id: 65,
        topic: "Geometry",
        question: "How many degrees in a straight line?",
        options: ["90", "180", "270", "360"],
        correctAnswer: "180",
        explanation: "A straight line forms a 180-degree angle."
    },
    {
        id: 66,
        topic: "Geometry",
        question: "What shape has 3 sides and 3 vertices?",
        options: ["Square", "Triangle", "Pentagon", "Hexagon"],
        correctAnswer: "Triangle",
        explanation: "A triangle has 3 sides and 3 corners."
    },
    {
        id: 67,
        topic: "Geometry",
        question: "What is the area of a rectangle 6 wide and 9 tall?",
        options: ["30", "54", "48", "60"],
        correctAnswer: "54",
        explanation: "Area = 6 × 9 = 54 square units."
    },
    {
        id: 68,
        topic: "Geometry",
        question: "How many degrees in a full circle?",
        options: ["90", "180", "270", "360"],
        correctAnswer: "360",
        explanation: "A full circle is 360 degrees."
    },
    {
        id: 69,
        topic: "Geometry",
        question: "What is the perimeter of a square with side 5?",
        options: ["10", "15", "20", "25"],
        correctAnswer: "20",
        explanation: "Perimeter = 4 × 5 = 20."
    },
    {
        id: 70,
        topic: "Geometry",
        question: "How many edges does a cube have?",
        options: ["6", "8", "12", "24"],
        correctAnswer: "12",
        explanation: "A cube has 12 edges."
    },

    // WORD PROBLEMS (15 questions)
    {
        id: 71,
        topic: "Word Problems",
        question: "Sarah has 24 stickers. She gives 8 to her friend. How many does she have left?",
        options: ["16", "32", "14", "18"],
        correctAnswer: "16",
        explanation: "24 - 8 = 16 stickers remaining."
    },
    {
        id: 72,
        topic: "Word Problems",
        question: "There are 5 boxes with 6 pencils each. How many pencils total?",
        options: ["11", "30", "25", "35"],
        correctAnswer: "30",
        explanation: "5 boxes × 6 pencils = 30 pencils."
    },
    {
        id: 73,
        topic: "Word Problems",
        question: "Jake has 12 apples to share equally among 3 friends. How many does each friend get?",
        options: ["4", "5", "3", "6"],
        correctAnswer: "4",
        explanation: "12 apples ÷ 3 friends = 4 apples each."
    },
    {
        id: 74,
        topic: "Word Problems",
        question: "A book costs $8 and a pencil costs $2. How much for both?",
        options: ["$6", "$10", "$12", "$14"],
        correctAnswer: "$10",
        explanation: "$8 + $2 = $10."
    },
    {
        id: 75,
        topic: "Word Problems",
        question: "Maya reads 15 pages on Monday and 20 pages on Tuesday. How many total?",
        options: ["5", "25", "35", "45"],
        correctAnswer: "35",
        explanation: "15 + 20 = 35 pages."
    },
    {
        id: 76,
        topic: "Word Problems",
        question: "A pizza is cut into 8 slices. You eat 3. How many are left?",
        options: ["5", "11", "8", "4"],
        correctAnswer: "5",
        explanation: "8 - 3 = 5 slices remain."
    },
    {
        id: 77,
        topic: "Word Problems",
        question: "There are 4 rows of chairs with 7 chairs in each row. How many total?",
        options: ["11", "28", "32", "24"],
        correctAnswer: "28",
        explanation: "4 rows × 7 chairs = 28 chairs."
    },
    {
        id: 78,
        topic: "Word Problems",
        question: "Lily has $50. She spends $15 on shoes. How much does she have left?",
        options: ["$35", "$65", "$25", "$40"],
        correctAnswer: "$35",
        explanation: "$50 - $15 = $35."
    },
    {
        id: 79,
        topic: "Word Problems",
        question: "A recipe calls for 2 cups of flour. How much for 3 recipes?",
        options: ["5 cups", "6 cups", "2 cups", "3 cups"],
        correctAnswer: "6 cups",
        explanation: "2 cups × 3 recipes = 6 cups."
    },
    {
        id: 80,
        topic: "Word Problems",
        question: "Tom has 40 cents and gets 25 more. How much does he have?",
        options: ["15 cents", "65 cents", "75 cents", "50 cents"],
        correctAnswer: "65 cents",
        explanation: "40 + 25 = 65 cents."
    },
    {
        id: 81,
        topic: "Word Problems",
        question: "A store has 60 apples. They sell 24. How many are left?",
        options: ["36", "84", "26", "40"],
        correctAnswer: "36",
        explanation: "60 - 24 = 36 apples."
    },
    {
        id: 82,
        topic: "Word Problems",
        question: "Emma runs 5 miles on Monday, 3 on Wednesday, 4 on Friday. Total?",
        options: ["8", "9", "12", "15"],
        correctAnswer: "12",
        explanation: "5 + 3 + 4 = 12 miles."
    },
    {
        id: 83,
        topic: "Word Problems",
        question: "A class has 24 students. 8 are absent. How many are present?",
        options: ["32", "16", "20", "28"],
        correctAnswer: "20",
        explanation: "24 - 8 = 20 students present."
    },
    {
        id: 84,
        topic: "Word Problems",
        question: "You buy 3 notebooks at $4 each. How much total?",
        options: ["$7", "$12", "$15", "$11"],
        correctAnswer: "$12",
        explanation: "3 × $4 = $12."
    },
    {
        id: 85,
        topic: "Word Problems",
        question: "A team scores 15 points in the first half and 18 in the second. Total?",
        options: ["3", "33", "23", "28"],
        correctAnswer: "33",
        explanation: "15 + 18 = 33 points."
    },

    // PERCENTAGES (10 questions)
    {
        id: 86,
        topic: "Percentages",
        question: "What is 50% of 20?",
        options: ["5", "10", "15", "20"],
        correctAnswer: "10",
        explanation: "50% means half: 20 ÷ 2 = 10."
    },
    {
        id: 87,
        topic: "Percentages",
        question: "What is 25% of 40?",
        options: ["10", "20", "30", "5"],
        correctAnswer: "10",
        explanation: "25% is 1/4: 40 ÷ 4 = 10."
    },
    {
        id: 88,
        topic: "Percentages",
        question: "What is 10% of 50?",
        options: ["5", "10", "25", "45"],
        correctAnswer: "5",
        explanation: "10% means 1/10: 50 ÷ 10 = 5."
    },
    {
        id: 89,
        topic: "Percentages",
        question: "What is 50% of 80?",
        options: ["30", "40", "50", "60"],
        correctAnswer: "40",
        explanation: "50% is half: 80 ÷ 2 = 40."
    },
    {
        id: 90,
        topic: "Percentages",
        question: "What is 75% of 16?",
        options: ["4", "8", "12", "16"],
        correctAnswer: "12",
        explanation: "75% is 3/4: (16 ÷ 4) × 3 = 4 × 3 = 12."
    },
    {
        id: 91,
        topic: "Percentages",
        question: "What is 20% of 50?",
        options: ["5", "10", "15", "20"],
        correctAnswer: "10",
        explanation: "20% of 50 = (20 ÷ 100) × 50 = 10."
    },
    {
        id: 92,
        topic: "Percentages",
        question: "What is 100% of 12?",
        options: ["12", "6", "24", "1"],
        correctAnswer: "12",
        explanation: "100% means the whole thing: 12."
    },
    {
        id: 93,
        topic: "Percentages",
        question: "What is 50% of 30?",
        options: ["10", "15", "20", "25"],
        correctAnswer: "15",
        explanation: "50% is half: 30 ÷ 2 = 15."
    },
    {
        id: 94,
        topic: "Percentages",
        question: "What is 25% of 80?",
        options: ["20", "30", "40", "50"],
        correctAnswer: "20",
        explanation: "25% is 1/4: 80 ÷ 4 = 20."
    },
    {
        id: 95,
        topic: "Percentages",
        question: "What is 10% of 100?",
        options: ["1", "10", "50", "100"],
        correctAnswer: "10",
        explanation: "10% of 100 = 10."
    },

    // PATTERNS & ALGEBRA (10 questions)
    {
        id: 96,
        topic: "Patterns",
        question: "What's next: 2, 4, 6, 8, ...?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
        explanation: "This sequence adds 2 each time. 8 + 2 = 10."
    },
    {
        id: 97,
        topic: "Patterns",
        question: "What's next: 5, 10, 15, 20, ...?",
        options: ["21", "22", "24", "25"],
        correctAnswer: "25",
        explanation: "This sequence adds 5 each time. 20 + 5 = 25."
    },
    {
        id: 98,
        topic: "Patterns",
        question: "What's next: 3, 6, 9, 12, ...?",
        options: ["13", "14", "15", "16"],
        correctAnswer: "15",
        explanation: "This sequence adds 3 each time. 12 + 3 = 15."
    },
    {
        id: 99,
        topic: "Patterns",
        question: "What's next: 1, 4, 9, 16, ...?",
        options: ["20", "25", "24", "36"],
        correctAnswer: "25",
        explanation: "These are perfect squares: 1², 2², 3², 4², 5² = 25."
    },
    {
        id: 100,
        topic: "Algebra",
        question: "If x + 5 = 12, what is x?",
        options: ["5", "7", "17", "2"],
        correctAnswer: "7",
        explanation: "x + 5 = 12, so x = 12 - 5 = 7."
    },
    {
        id: 101,
        topic: "Algebra",
        question: "If x - 3 = 8, what is x?",
        options: ["5", "11", "24", "3"],
        correctAnswer: "11",
        explanation: "x - 3 = 8, so x = 8 + 3 = 11."
    },
    {
        id: 102,
        topic: "Algebra",
        question: "If 2x = 10, what is x?",
        options: ["5", "8", "12", "20"],
        correctAnswer: "5",
        explanation: "2x = 10, so x = 10 ÷ 2 = 5."
    },
    {
        id: 103,
        topic: "Patterns",
        question: "What's next: 10, 20, 30, 40, ...?",
        options: ["45", "50", "55", "60"],
        correctAnswer: "50",
        explanation: "This sequence adds 10 each time. 40 + 10 = 50."
    },
    {
        id: 104,
        topic: "Algebra",
        question: "If x + 8 = 15, what is x?",
        options: ["7", "23", "8", "6"],
        correctAnswer: "7",
        explanation: "x + 8 = 15, so x = 15 - 8 = 7."
    },
    {
        id: 105,
        topic: "Patterns",
        question: "What's next: 100, 90, 80, 70, ...?",
        options: ["50", "60", "65", "75"],
        correctAnswer: "60",
        explanation: "This sequence subtracts 10 each time. 70 - 10 = 60."
    }
];
