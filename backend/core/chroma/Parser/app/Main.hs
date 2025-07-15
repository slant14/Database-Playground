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
        res = runParser Parser.parseQuery "" input
    case res of
      Left err    -> do
        status status400
        text $ TL.pack ("Parse error: " ++ show err)
      Right value -> do
        setHeader "Content-Type" "application/json"
        text $ TL.pack value
