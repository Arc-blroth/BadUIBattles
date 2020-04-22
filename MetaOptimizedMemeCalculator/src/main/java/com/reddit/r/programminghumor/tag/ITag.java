package com.reddit.r.programminghumor.tag;

import java.awt.Color;

public interface ITag {
	
	public default Color getFlairColor() {return new Color(237, 239, 241);}
	
	public String getTagText();
	
}
