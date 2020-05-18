package ai.arcblroth.phumor.metacalculator;

import java.io.Console;
import java.math.BigInteger;
import java.net.URI;
import java.util.ArrayList;
import java.util.IllegalFormatException;
import java.util.List;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import com.reddit.r.programminghumor.tag.Trend;

/**
 * <h1>Meta-Optimized-Calculator</h1>
 * A very unoptimized calculator written in Javascript,
 * generated by yet another unoptimized program written in Java.
 * <br />
 * Be sure to watch out for all the unoptimization comments and easter eggs!
 * 
 * @author Arc'blroth
 * @see <a href="https://www.reddit.com/r/ProgrammerHumor/comments/dtu5if/calculator_challenge_accepted/">Original Post</a>
 * @see <a href="https://www.reddit.com/r/ProgrammerHumor/comments/dtzkkl/i_got_bored_and_decided_to_do_the_same_thing_as/">Another One</a>
 */
public class MetaOptimizedMemeCalculator implements Trend {
	
	private static final ScriptEngine JS_ENGINE;
	
	//WHY ARE WE USING STATIC BLOCKS INSTEAD OF A STATIC INSTANCE
	static {
		//For benchmarking purposes (to test just how inefficent this is):
		System.out.println("[0/2] Initilizing Arc'blroth's MetaOptimizedMemeCalculator...");
		long startTime = System.currentTimeMillis();
		long everySecCounter = startTime;
		BigInteger maxIntValue = BigInteger.valueOf(Integer.MAX_VALUE);
		int currentOperator = -1;
		
		JS_ENGINE = new ScriptEngineManager().getEngineByName("nashorn");
		//Normally I'd use StringBuilders, but who needs to be optimized?
		String calcFuncDeclaration = "function calculate(firstNum, operator, secondNum) {%s}";
		String ifStatement = "if(firstNum == %s && operator == %s && secondNum == %s) {print(%s);} ";
		String elseIfStatement = "else if(firstNum == %s && operator == %s && secondNum == %s) {print(%s);} "; //DUPLICATED CODE? DUN DUN DUN
		String badBuilder = "";
		boolean isFirstIf = true;
		/* 
		 * I'm pretty sure the below block is enough to make some people cry.
		 * 1. Just... WHY? Do I even know what an enum is?
		 * 2. Switch statement. Thanks for coming to my TED talk.
		 * 3. Profit! (from job security, most likely)
		 */
		for(String operator : new String[] {"+", "-", "*", "/"}) {
			/*benchmarking variable*/ currentOperator++;
			//99% sure there's a better way to do this
			String whichIfStatementToUse = elseIfStatement;
			if(isFirstIf) {
				whichIfStatementToUse = ifStatement;
				isFirstIf = !isFirstIf;
			}
			//Notice usage of chad incrementation
			for(int first = Integer.MIN_VALUE; first <= Integer.MAX_VALUE; first-=-1) {
				for(int second = Integer.MIN_VALUE; second <= Integer.MAX_VALUE; second-=-1) {
					switch(operator) {
					//We're using BigIntegers because otherwise things break.
					
					/* 
					 * To quote from https://stackoverflow.com/questions/3878192/converting-from-integer-to-biginteger
					 * 
					 *     "Making a String first is unnecessary and undesired."
					 *       ~ jbindel
					 * 
					 * Perfect.
					 */
					
					case "+": {
						badBuilder += String.format(whichIfStatementToUse, first, operator, second,
								new BigInteger(Integer.toString(first)).add(new BigInteger(Integer.toString(second))).toString());
						break;
					}
					case "-": {
						badBuilder += String.format(whichIfStatementToUse, first, operator, second,
								new BigInteger(Integer.toString(first)).subtract(new BigInteger(Integer.toString(second))).toString());
						break;
					}
					case "*": {
						badBuilder += String.format(whichIfStatementToUse, first, operator, second,
								new BigInteger(Integer.toString(first)).multiply(new BigInteger(Integer.toString(second))).toString());
						break;
					}
					case "/": {
						if(second == 0) {
							badBuilder += String.format(whichIfStatementToUse, first, operator, second, "We don't do it here");
						} else {
							badBuilder += String.format(whichIfStatementToUse, first, operator, second,
									new BigInteger(Integer.toString(first)).divide(new BigInteger(Integer.toString(second))).toString());
						}
						//Notice lack of break statement.
					}
					default: {
						/* 
						 * This block makes no sense, and is only executed because
						 * of the above missing break statement.
						 */
					}
					}
					if(System.currentTimeMillis() - everySecCounter >= 1_000) {
						//For the purposes of not skewing results, we kinda optimize the benchmarking.
						//Also don't question the math here.
						System.out.printf("[1/2] Building String... [%s/%s]\n",
								BigInteger.valueOf(currentOperator).multiply(maxIntValue.multiply(BigInteger.valueOf(2)).pow(2)).add(
										BigInteger.valueOf(first).add(maxIntValue).add(BigInteger.ONE)
											.multiply(maxIntValue).add(BigInteger.valueOf(second).add(maxIntValue).add(BigInteger.ONE))),
								maxIntValue.multiply(BigInteger.valueOf(2)).add(BigInteger.ONE).pow(2).multiply(BigInteger.valueOf(4))
						);
						everySecCounter = System.currentTimeMillis();
					}
				}
			}
		}
		calcFuncDeclaration = String.format(calcFuncDeclaration, badBuilder);
		System.out.printf("[1/2] Finished building program string (took %.3f seconds), loading into engine...\n", ((double)(System.currentTimeMillis() - startTime))/60D);
		try {
			JS_ENGINE.eval(calcFuncDeclaration);
		} catch (ScriptException e) {
			//I wouldn't really blame the engine if it crashed at this point.
			e.printStackTrace();
		}
		System.out.printf("[2/2] Finished initilization (took %.3f seconds)!\n\n", ((double)(System.currentTimeMillis() - startTime))/60D);
	}
	
	@Override
	public List<URI> getParents() {
		List<URI> parents = new ArrayList<URI>();
		parents.add(URI.create("https://www.reddit.com/r/ProgrammerHumor/comments/dtu5if/calculator_challenge_accepted/"));
		parents.add(URI.create("https://www.reddit.com/r/ProgrammerHumor/comments/dtzkkl/i_got_bored_and_decided_to_do_the_same_thing_as/"));
		return parents;
	}

	//Code made to match Orignal Post as much as possible.
	public static void main(String[] args) {
		Console console = System.console();
		try {
			console.writer().println("Enter first num:");
			int firstNum = Integer.parseInt(console.readLine());
			console.writer().println("Enter operator:");
			String oper = console.readLine();
			console.writer().println("Enter second num:");
			int secondNum = Integer.parseInt(console.readLine());
			calculate(firstNum, oper, secondNum);
		} catch(IllegalFormatException yeet) {
			console.writer().println("Wrong format");
		}
	}
	
	public static void calculate(int firstNum, String oper, int secondNum) {
		//Not using String.format anymore
		try {
			JS_ENGINE.eval("calculate(" + firstNum + ", " + oper + ", " + secondNum + ");");
		} catch (ScriptException e) {/*Shut it up like a pog*/}
	}
	
}