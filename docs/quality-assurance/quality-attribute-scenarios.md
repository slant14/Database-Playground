## Reliability
### Fault tolerance

Fault tolerance is the bedrock of a reliable and uninterrupted experience. The customer relies on software system to be consistently available and perform as expected.

#### Test Scenario 1: Inappropriate Query Request Handling
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Fault tolerance                                                      |
| Source            | User Interface                                                       |
| Stimulus          | Inappropriate query request  (e.g., malformed syntax, unauthorized access attempt, non-existent entity ID) |
| Artifact          | Error handler, Query parsing module, Authorization service           |
| Environment       | Production environment during query execution                        |
| Response          | System catches the error and provides a clear, user-friendly error message to the user |
| Response Measure  | System downtime is less than 1 second, with no loss of user sessions or data |

Test Execution:

1. **Setup**: Deploy the application to a test environment, including realistic data volumes and user load

2. **Stimulation**: Use a custom script to send a series of deliberately malformed or unauthorized query requests to the system's query endpoint 
   - Requests from unauthorized user
   - Empty reques  
   - Queries with incorrect syntax or missing mandatory parameters  
   - User did not choose type of database to execute

3. **Observation and Verification**:  
   - Monitor the application's response time to ensure it remains below 1 second  
   - Verify the system returns appropriate HTTP status codes
   - Check server logs for detailed error traces and incident logging  
   - Confirm no unexpected session terminations or data corruption  


#### Test Scenario 2: Invalid Input Data Processing
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Fault tolerance                                                       |
| Source            | User interface                                         |
| Stimulus          | Submission of data violating business rules (e.g., invalid email format, missing mandatory fields) |
| Artifact          | Error handler, Authorization service, Database schema validation      |
| Environment       | User interaction during data entry in signing up or registration      |
| Response          | System rejects invalid input, provides specific actionable error feedback to user, prevents erroneous data persistence |
| Response Measure  | Invalid inputs rejected within less than 1 second. Precise error messages (e.g., "Email format invalid", "Weak password") with no erroneous data stored |

Test Execution:

1. **Setup**: Prepare a test environment with the application deployed and access to its database. Identify all input fields and API parameters that have validation rules (e.g., data type, format)

2. **Stimulation**: Try to sign in or register using inapproriate info.  
   - Sign up
       - Non-existent username or email
       - Invalid password
       - Leave some fields empty
   - Registration
       - Username or passwords already used by another user
       - Inappropriate email format
       - Not matching password
       - Leave some fields empty

3. **Observation and Verification**:  
   - Verify that the system responds within 1 second
   - Confirm that the UI displays immediate, field-specific error messages
   - Attempt to retrieve the submitted invalid data from the database to confirm it was not persisted  
   - Check application logs for validation errors, ensuring they are logged appropriately without exposing sensitive information  

## Performance Efficiency
### Time Behaviour

Time behaviour is synonymous with efficiency and responsiveness. A system that performs well translates directly into a positive and productive user experience.

#### Test Scenario 1: Concurrent Chroma DB Creation
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Time behaviour                                                        |
| Source            | Multiple users simultaneously create Chroma database                  |
| Stimulus          | 20 students want to create Chroma DB in the beginning of the class    |
| Artifact          | DPP application handling creation submission requests                 |
| Environment       | Production environment during peak usage period                       |
| Response          | The system processes all submissions with significant delay and maintains responsiveness |
| Response Measure  | Average response time for submission is 60 seconds, with no timeouts or failures |

Test Execution:

1. **Setup**: Deploy the application and its underlying Chroma DB infrastructure to a test environment scaled to production specifications. Ensure monitoring tools are in place to capture server-side metrics (CPU, memory) and application logs

2. **Stimulation**: Use a load testing tool LoadRunner configured to simulate 20 concurrent virtual users. Each virtual user should execute the "create Chroma DB" workflow  
   - Incorporate "think time" between steps within each user's workflow (e.g., pause after submitting a form, before confirming creation) to mimic realistic user behavior
   - Configure the load test to start all 20 users simultaneously or within a very short ramp-up period to simulate the "beginning of the class" scenario

3. **Observation and Verification**:  
   - Measure the end-to-end response time for each "create Chroma DB" submission from the perspective of the load testing tool
   - Calculate the average response time across all 20 submissions and verify it is within the 60-second target
   - Confirm that none of the submissions result in timeouts or errors
   - Monitor server-side metrics to identify any resource bottlenecks (e.g., CPU saturation, memory pressure, database contention) that contribute to the delay
   - Check application logs for any errors or warnings during the test


#### Test Scenario 2: High-Volume Data Retrieval
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Time behaviour                                                           |
| Source            | End-user performing a search                                          |
| Stimulus          | Request to retrieve 100 records from core data store                  |
| Artifact          | Data access layer, Database, Query parsing module                     |
| Environment       | Production environment under moderate load (20 concurrent users performing other actions) |
| Response          | System efficiently retrieves and delivers requested data without impacting other operations |
| Response Measure  | Data retrieval completes within 60 seconds for 99% of requests         |

Test Execution:

1. **Setup**: Ensure the test environment has a database populated with at least 100 relevant records. Deploy the application components responsible for data retrieval

2. **Stimulation**:   
   - Targeted Load: Write a dedicated performance test script database query responsible for retrieving 100 records
   - Background Load: Simultaneously, simulate a moderate background load (e.g., 50 concurrent users performing typical application interactions) to ensure the high-volume retrieval doesn't          degrade overall system performance

3. **Observation and Verification**:  
   - Measure the average and 99th percentile response time for the data retrieval requests. Verify it is within the 60-second target
   - Monitor database performance metrics, including query execution time and I/O operations
   - Observe the network latency and throughput for the data transfer
   - Check application logs for any errors or warnings during the retrieval process
   - Verify the completeness and correctness of the retrieved data

## Flexibility
### Scalability

Scalability translates directly into a future-proof and reliable investment. It assures that the software will continue to meet evolving needs and grow alongside business without requiring costly and disruptive overhauls.

#### Test Scenario 1: New Database Integration
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Scalability                                                           |
| Source            | Someone wants to add functionality                                    |
| Stimulus          | Another developer adds support of a new database                      |
| Artifact          | Microservices architecture                                            |
| Environment       | Normal function in the development mode                               |
| Response          | The existing microservices seamlessly integrate with the new database, allowing data operations without requiring significant changes to other services or core application logic   |
| Response Measure  | New database support is fully integrated, tested, and validated in less than 5 person-days, with no regression in existing functionality and no performance degradation for existing features                                                                           |

Test Execution:

1. **Setup**: Ensure the application is built with a modular or microservices architecture, promoting loose coupling and clear separation of concerns. Prepare a development environment with the necessary tools and access to the new database technology

2. **Stimulation**:   
   - A developer implements the necessary database drivers, data access layer components, and configuration changes to enable connectivity and basic Create, Read, Update, Delete operations with      the new database
   - This might involve creating a new microservice specifically for managing data in the new database or extending an existing service to support both databases

3. **Observation and Verification**:  
   - Track the actual person-days spent on integration, development, and testing. Verify it is less than 5 person-days
   - Run comprehensive unit and integration tests specifically for the new database integration to verify correct data storage and retrieval
   - Execute the full regression test suite for existing functionalities to ensure that the addition of the new database support has not introduced any bugs or broken existing feature
   - Run performance tests on existing features to confirm no performance degradation
   - Verify the completeness and correctness of the retrieved data

#### Test Scenario 2: New Feature Module Addition
| Scenario Part     | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| Quality Attribute | Scalability                                                           |
| Source            | Product development team or business stakeholder                      |
| Stimulus          | Addition of new independent feature module (e.g., recommendation engine, chat module) |
| Artifact          | Modular architecture, service discovery mechanism, API contracts      |
| Environment       | Development/staging environment mimicking production deployment pipelines |
| Response          | New module integrates without core service modifications or application downtime |
| Response Measure  | Feature deployed and functional within 2 days with zero impact on existing service availability or performance |

Test Execution:

1. **Setup**: Ensure the system architecture supports modularity and independent deployment of services. Set up a CI/CD pipeline for automated deployment to a staging environment

2. **Stimulation**:   
   - Develop the new feature as a self-contained module or microservice, adhering to defined API contracts for interaction with existing services
   - Trigger the deployment pipeline for this new module

3. **Observation and Verification**:  
   - Measure the total time taken for the new module to be deployed and become functional in the staging environment (should be within 2 days)
   - Perform specific functional tests on the new module to ensure it works as expected
   - Run integration tests to verify seamless communication between the new module and existing services
   - Execute a comprehensive regression test suite on existing core functionalities to confirm no unintended side effects or performance degradatio



