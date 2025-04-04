type TestInput = {
    date: string;
    location: string;
    tipPercentage: number;
    items: {
      price: number;
      name: string;
      isShared: boolean;
      person?: string; // Optional, only for non-shared items
    }[];
  };
  
  type TestOutput = {
    date: string;
    location: string;
    subTotal: number;
    tip: number;
    totalAmount: number;
    items: {
      name: string;
      amount: number;
    }[];
  };
  
  function processInput(input: TestInput): TestOutput {
    const { date, location, tipPercentage, items } = input;
  
    let subTotal = 0;
    const nameList: { [key: string]: number } = {};
    const sharedParticipants: Set<string> = new Set();
    let sharedTotal = 0;
  
    // Step 1: 計算小計並追蹤均分參與者
    for (const item of items) {
      subTotal += item.price;
  
      if (item.isShared) {
        sharedTotal += item.price;
        if (item.person) {
          sharedParticipants.add(item.person); // 添加均分參與者
        }
      } else if (item.person) {
        // 處理個人項目
        nameList[item.person] = (nameList[item.person] || 0) + item.price;
      }
    }
  
    // Step 2: 平均分配均分項目的費用
    const sharedAmountPerPerson =
      sharedParticipants.size > 0 ? sharedTotal / sharedParticipants.size : 0;
    for (const person of sharedParticipants) {
      nameList[person] = (nameList[person] || 0) + sharedAmountPerPerson;
    }
  
    // Step 3: 計算小費和總金額
    const tip = (subTotal * tipPercentage) / 100;
    const totalAmount = subTotal + tip;
  
    // Step 4: 按比例分配小費並處理舍入
    const roundedNameList: { [key: string]: number } = {};
    let totalRounded = 0;
  
    for (const name in nameList) {
      const amountWithTip = nameList[name] + (nameList[name] / subTotal) * tip;
      const roundedAmount = parseFloat(amountWithTip.toFixed(1));
      roundedNameList[name] = roundedAmount;
      totalRounded += roundedAmount;
    }
  
    const roundingError = parseFloat(totalAmount.toFixed(1)) - totalRounded;
  
    // 調整舍入誤差給第一個人
    if (Math.abs(roundingError) > 0.01) {
      const firstPerson = Object.keys(roundedNameList)[0];
      if (firstPerson) {
        roundedNameList[firstPerson] += roundingError;
      }
    }
  
    // Step 5: 構建輸出
    const outputItems = Object.entries(roundedNameList).map(([name, amount]) => ({
      name,
      amount,
    }));
  
    return {
      date: date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1年$2月$3日"), // 格式化日期
      location,
      subTotal: parseFloat(subTotal.toFixed(2)),
      tip: parseFloat(tip.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      items: outputItems,
    };
  }
  
  // 測試函數
  function runTests() {
    console.log("Running Tests...");
  
    const input1: TestInput = {
      date: "2024-03-21",
      location: "開心小館",
      tipPercentage: 10,
      items: [
        { price: 82, name: "牛排", isShared: true },
        { price: 10, name: "橙汁", isShared: false, person: "Alice" },
        { price: 8, name: "熱檸檬水", isShared: false, person: "Bob" },
      ],
    };
    const expectedOutput1: TestOutput = {
      date: "2024年03月21日",
      location: "開心小館",
      subTotal: 100,
      tip: 10,
      totalAmount: 110,
      items: [
        { name: "Alice", amount: 56.1 },
        { name: "Bob", amount: 53.9 },
      ],
    };
    const result1 = processInput(input1);
    console.assert(
      JSON.stringify(result1) === JSON.stringify(expectedOutput1),
      `Test Case 1 Failed: Expected ${JSON.stringify(
        expectedOutput1
      )}, got ${JSON.stringify(result1)}`
    );
  
    const input2: TestInput = {
      date: "2024-03-21",
      location: "開心小館",
      tipPercentage: 10,
      items: [
        { price: 199, name: "牛排", isShared: true },
        { price: 10, name: "橙汁", isShared: false, person: "Alice" },
        { price: 12, name: "薯條", isShared: true },
        { price: 8, name: "熱檸檬水", isShared: false, person: "Bob" },
        { price: 8, name: "熱檸檬水", isShared: false, person: "Charlie" },
      ],
    };
    const expectedOutput2: TestOutput = {
      date: "2024年03月21日",
      location: "開心小館",
      subTotal: 237,
      tip: 23.7,
      totalAmount: 260.7,
      items: [
        { name: "Alice", amount: 88.3 },
        { name: "Bob", amount: 86.2 },
        { name: "Charlie", amount: 86.2 },
      ],
    };
    const result2 = processInput(input2);
    console.assert(
      JSON.stringify(result2) === JSON.stringify(expectedOutput2),
      `Test Case 2 Failed: Expected ${JSON.stringify(
        expectedOutput2
      )}, got ${JSON.stringify(result2)}`
    );
  
    const input3: TestInput = {
      date: "2024-03-21",
      location: "開心小館",
      tipPercentage: 10,
      items: [
        { price: 194, name: "牛排", isShared: true },
        { price: 10, name: "橙汁", isShared: false, person: "Alice" },
        { price: 10, name: "橙汁", isShared: false, person: "Bob" },
        { price: 10, name: "橙汁", isShared: false, person: "Charlie" },
      ],
    };
    const expectedOutput3: TestOutput = {
      date: "2024年03月21日",
      location: "開心小館",
      subTotal: 224,
      tip: 22.4,
      totalAmount: 246.4,
      items: [
        { name: "Alice", amount: 82.2 },
        { name: "Bob", amount: 82.1 },
        { name: "Charlie", amount: 82.1 },
      ],
    };
    const result3 = processInput(input3);
    console.assert(
      JSON.stringify(result3) === JSON.stringify(expectedOutput3),
      `Test Case 3 Failed: Expected ${JSON.stringify(
        expectedOutput3
      )}, got ${JSON.stringify(result3)}`
    );
  
    console.log("All test cases passed!");
  }
  
  runTests();