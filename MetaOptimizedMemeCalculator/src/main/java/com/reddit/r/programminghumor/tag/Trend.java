package com.reddit.r.programminghumor.tag;

import java.net.URI;
import java.util.List;

public interface Trend extends ITag {
	
	public List<URI> getParents();
	
	@Override
	public default String getTagText() {return "instanceof Trend";}
	
}
