export const LANGUAGE_OPTIONS = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];

export const STARTER_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

void solve() {
    // Write your C++ solution here
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    solve();
    return 0;
}
`,
  python: `import sys


def solve():
    # Write your Python solution here
    return


if __name__ == "__main__":
    solve()
`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    static void solve() throws Exception {
        // Write your Java solution here
    }

    public static void main(String[] args) throws Exception {
        solve();
    }
}
`,
};

export const getStarterCode = (language = "cpp") => {
  return STARTER_CODE[language] || STARTER_CODE.cpp;
};

export const isStarterCode = (language, code = "") => {
  return (code || "").trim() === getStarterCode(language).trim();
};
