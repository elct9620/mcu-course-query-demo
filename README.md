銘傳課程查詢範例
===

這是銘傳大學課程查詢的範例功能，僅用於測試資料的正確性以及相關功能的使用技巧。

需求
---

* Bower
* SASS / Scss
* CoffeeScript
* Fire.app (Optionals)

安裝
---

執行 `bower install` 安裝相依的 JavaScript 套件即可。

使用
---

無，如需資料庫相關設定，請使用 [MCUCourseCLI](https://github.com/elct9620/MCUCourseCLI) 套件輔助取得資料。
註：MCUCourseCLI 仍在開發中，可能會與實際情況有所差異

### 匯出 SQL 供查詢系統使用
1. `echo "DBConnection[driver]=sqlite\nDBConnection[database]=mcu.sqlite" > .mcuConfig`
2. `mcucli migrate` (這裡的 mcucli 為 MCUCourseCLI 的 alias)
3. `mcucli course`
4. `sqlite3 mcu.sqlite .dump > mcu.sql`
