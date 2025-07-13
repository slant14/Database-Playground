# Changelog

All notable changes to this project will be documented in this file.

The format is based on s[Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]s
Changes not yet assigned to any particular release

### Added
*...*

### Changed 
*...*

### Fixed
*...*

### Deprecated
*...*

### Removed
*...*


## [0.1.1] Pre Merge - 2025-07-09
The version is a save before the **Great Merge**  
It encorparates main changes of Team 37 for **MVP 2**

### Added
- Support for MongoDB on backend (via `MongoEngine`)

### Changed 
- Rename `SQLEngine` to `DBEngine`
- Rewritten frontend-37 from JavaScript to TypeScript

### Fixed
- *Frontenders, add here, please...*


## [0.1.0] MVP 1 - 2025-06-23
The first version with some kind of functionality

### Added
- Idea of replacable database engines as architectural basis
- Interface `SQLEngine`, depicting main functionality, like:
    - Getting list of existing Databases
    - Creating Databases
    - Dropping Databases
    - Getting snapshot of Databases (by getting their dump)
    - Executing SQL queries
- Support for `PostgreSQL` in Playground via `PostgresEngine` (implements `SQLEngine`)
- Database **Templates System** for saving the state of databases  
    The idea is that *Template is a snapshot* of database.  
    Basically it's an object that contains information required to recreate the existing database from a blank one.
- Basic structure of an API on `Django` and `DjangoREST`
- Basic frontend on `React`
- Basic **CI/CD** and `Docker` to deploy easily
- Some testing of `PostgresEngine` done using `pytest`


## [0.0.1] MVP 0 - 2025-06-11
The deploy-first version, nothing more

### Added
- Minimal Frontend Page
- Deployed via Docker Compose to server
