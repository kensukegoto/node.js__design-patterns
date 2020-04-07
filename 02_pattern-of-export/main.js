// オブジェクトのエクスポート
const logger = require("./logger");
logger.info("一般情報提供用のメッセージ");
logger.verbose("詳細情報提供用のメッセージ");

// 関数のエクスポート
const logger2 = require("./logger2");
logger2("一般情報提供用のメッセージ");
logger2.verbose("詳細情報提供用のメッセージ");

// クラスのエキスポート
const Logger = require("./logger3");
const dbLogger = new Logger("DB");
dbLogger.info("一般情報提供用のメッセージ");
const accessLogger = new Logger("ACCESS");
accessLogger.verbose("詳細情報提供用のメッセージ");

// インスタンスのエキスポート
const logger4 = require("./logger4");
logger4.log("This is an information message");
const customLogger = new logger4.Logger("CUSTOM");
customLogger.log("This is an information message");

// 何もエキスポートしない
require("./patcher");
const logger5 = require("./logger4");
logger5.customMessage();