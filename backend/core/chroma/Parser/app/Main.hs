{-# LANGUAGE OverloadedStrings #-}

module Main where

import Web.Scotty
import qualified Parser
import Text.Megaparsec
import qualified Data.Text.Lazy as TL
import qualified Data.ByteString.Lazy.Char8 as BL
import Network.HTTP.Types (status400)

main :: IO ()
main = scotty 8080 $ do
  post "/parse" $ do
    query <- body
    let input = BL.unpack query
        res = Parser.runParseAllQueriesAsJson input
    setHeader "Content-Type" "application/json"
    text $ TL.pack res
