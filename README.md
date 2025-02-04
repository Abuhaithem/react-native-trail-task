

# Convose React Native Cofounder Trial Task:

## Implement a Search Functionality:

Here are the details of how you should implement the search functionality, ensuring it works as expected:

1. When you type something in the text input, it should call the endpoint, fetch the results, and display them as if they are coming from the backend.
2. The search functionality should be optimized and follow best practices (clean code and performance should be prioritized).
3. Add skeleton loading to indicate data is being loaded. Once the data is loaded, display the actual results in its place.
4. Display skeleton loading when the user scrolls up to view more interests.

- You can see the implemented version at [https://convose.com](https://convose.com).
- Review how we implemented skeleton loading, fetching more data, and displaying and filtering data immediately after the user types the next character.

![image.png](/images/convose-add-interest-button.png)

5. The search should utilize previously fetched data (if available) and display it until the next set of results is received from the backend.

---

**Detailed Explanation of Searching Through Previous Data:**

For example, if the **Request** is:

```
https://be-v2.convose.com/autocomplete/interests?q=English&limit=5&from=0
```

And the **Response from Backend** is:

```
{
    "autocomplete": [
        {
            "id": 1415,
            "name": "Convose",
            "type": "general",
            "match": 41675,
            "color": "#19AAEB",
            "avatar": "https://cdn.convose.com/images/variants/kibcfku9wi9dkyln7x1w1ynhyzvp/a92a8ca453f3bc63bf52cb27bb8bf545027fb8cc7a2e6281bc67be0b9406d888",
            "existing": true
        },
        {
            "id": 2302,
            "name": "Construction",
            "type": "general",
            "match": 23,
            "color": "#BB6BD9",
            "avatar": null,
            "existing": false
        },
        {
            "id": 65687,
            "name": "Content creation",
            "type": "general",
            "match": 22,
            "color": "#F2994A",
            "avatar": null,
            "existing": false
        },
        {
            "id": 64519,
            "name": "Content writing",
            "type": "general",
            "match": 13,
            "color": "#19AAEB",
            "avatar": null,
            "existing": false
        },
        {
            "id": 64322,
            "name": "Conlangs [Constructed languages]",
            "type": "general",
            "match": 9,
            "color": "#9B51E0",
            "avatar": null,
            "existing": false
        }
    ],
    "pages_left": 15
}

// the name of the interest is in the following format "primary search term [secondry search term 1, secondry search term 2...]"
// Secondry search terms are optional and will be added in square brackets('[', ']') 
```

If the user then types:

```
English Gr
```

The frontend search algorithm should immediately display "English Grammar" using previously fetched data until the new backend response is received.

---

**API Documentation:**

You can find the documentation for the API here:  
[https://shadowed-camelotia-c37.notion.site/Interests-Autocomplete-API-184fff04b6f180a9a7add4a5524a7a9d](https://www.notion.so/184fff04b6f180a9a7add4a5524a7a9d?pvs=21)

---

**Expected Behavior:**

![image.png](/images/image.png)

- Results should be listed from bottom to top in the app (refer to the screenshot above).
- Ensure there is no unnecessary flashing of the list. For example, when deleting or adding characters, the list should not jump around or unnecessarily disappear and reappear.

---

**Additional Notes:**

Feel free to make any other improvements you think would enhance the functionality.

You can build the project with CLI (preferred), but Expo is also fine.  
Please generate an APK file for Josh to test.
