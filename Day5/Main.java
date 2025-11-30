import java.util.Date;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;


class FutureClassDemo{

    private static void log(String message){
        System.out.println("Logging from the thread " + Thread.currentThread().getName() + " " +
                "message");
    }

    public static CompletableFuture<String> fetchUserId(String username) throws RuntimeException{
        return CompletableFuture.supplyAsync(() -> {
            log("Service 1: Starting to fetch user ID for " + username);
            try{
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                log("Service 1: Execution failed ");
                throw new RuntimeException("User not found");
            }
            log("User found " + username);
            return "U-" + ThreadLocalRandom.current().nextInt(1000, 9999);
        });
    }

    public static CompletableFuture<String> fetchUserDetailsFromId(String id){
        return CompletableFuture.supplyAsync(() -> {
           log("Fetching User Details for the id " + id);
           try {
               TimeUnit.SECONDS.sleep(1);
           }catch (InterruptedException e){
               log("Fetching the details of the user failed " + id);
               throw new RuntimeException("User with the id " + id + " not found");
           }
            return "Details: " + id + " | Email: " + id.toLowerCase() + "@example.com";
        });
    }

    public static CompletableFuture<String> fetchProfileImage(String userId){
        return CompletableFuture.supplyAsync(() -> {
            log("Fetching the image details for the user " + userId);
            try{
                TimeUnit.SECONDS.sleep(1);
            }catch (InterruptedException e){
                log("Fetching the details of the user failed " + userId);
                throw new RuntimeException("User with the id " + userId + " not found");
            }
            return "https://cdn.img.com/" + userId + "/profile.jpg";
        });
    }

    public static void runWorkflow(){
        long startTime = System.currentTimeMillis();
        long endTime = System.currentTimeMillis();

        CompletableFuture<String> fetchUserDetails = fetchUserId("anshul")
                .thenCompose((id) -> fetchUserDetailsFromId(id))
                .thenApply(details -> {
                    return details.toUpperCase();
                });

        CompletableFuture<String> fetchUserProfileImage = fetchProfileImage("anshul");

        CompletableFuture<String> combineFuture = fetchUserDetails.thenCombine(
                fetchUserProfileImage,
                (detals, image) -> {
                    return String.format(
                            "FINAL REPORT:\n\tDetails: %s\n\tImage URL: %s",
                            detals,
                            image
                    );
                }
        ).exceptionally(ex -> {
            log("Service E: Caught Exception! Recovering gracefully.");
            return "FINAL REPORT:\n\tStatus: FAILED\n\tReason: " + ex.getMessage();
        });

        String finalResult = combineFuture.join();

        long totalTime = endTime - startTime;
        System.out.println("The complete process got completed in " + totalTime + " " );
    }
}

class Main{
    public static void main(String[] args){
        FutureClassDemo.runWorkflow();
    }
}